import { v4 as uuidv4 } from 'uuid';
import prisma from '@/config/database';
import { config } from '@/config/app';
import { hashPassword, comparePassword } from '@/common/helpers/password';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/common/helpers/jwt';
import { sendEmail } from '@/common/helpers/email';
import { AppError, UnauthorizedError, NotFoundError, ValidationError } from '@/common/errors';
import type {
  RegisterInput,
  LoginInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  AuthResponse,
} from './types';

export const register = async (input: RegisterInput): Promise<{ message: string }> => {
  const { email, password, firstName, lastName, role } = input;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new ValidationError('Email already registered');
  }

  const hashedPassword = await hashPassword(password);
  const verificationToken = uuidv4();
  const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role || 'STUDENT',
      verificationToken,
      tokenExpiresAt,
      profile: {
        create: {
          firstName,
          lastName,
        },
      },
    },
    include: {
      profile: true,
    },
  });

  const verificationUrl = `${config.app.clientUrl}/verify-email?token=${verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: 'Verify Your Email - 3i Institute',
    template: 'verification',
    data: {
      name: `${firstName} ${lastName}`,
      verificationUrl,
      year: new Date().getFullYear(),
    },
  });

  return { message: 'Registration successful. Please check your email to verify your account.' };
};

export const verifyEmail = async (input: VerifyEmailInput): Promise<{ message: string }> => {
  const { token } = input;

  const user = await prisma.user.findUnique({ where: { verificationToken: token } });

  if (!user) {
    throw new ValidationError('Invalid verification token');
  }

  if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
    throw new ValidationError('Verification token has expired');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
      tokenExpiresAt: null,
      status: 'ACTIVE',
    },
  });

  return { message: 'Email verified successfully. You can now login.' };
};

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const { email, password } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (user.status === 'SUSPENDED') {
    throw new UnauthorizedError('Account is suspended. Contact support.');
  }

  if (user.status === 'REJECTED') {
    throw new UnauthorizedError('Account registration was rejected.');
  }

  if (!user.emailVerified) {
    throw new UnauthorizedError('Please verify your email before logging in.');
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(tokenPayload);
  const refreshToken = generateRefreshToken(tokenPayload);

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
      profile: user.profile
        ? { firstName: user.profile.firstName, lastName: user.profile.lastName }
        : null,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (
  refreshTokenValue: string,
): Promise<{ accessToken: string; refreshToken: string }> => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshTokenValue },
  });

  if (!storedToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw new UnauthorizedError('Refresh token expired');
  }

  const decoded = verifyRefreshToken(refreshTokenValue);

  // Delete old refresh token
  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  // Generate new tokens
  const tokenPayload = { id: decoded.id, email: decoded.email, role: decoded.role };
  const newAccessToken = generateAccessToken(tokenPayload);
  const newRefreshToken = generateRefreshToken(tokenPayload);

  // Store new refresh token
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const forgotPassword = async (input: ForgotPasswordInput): Promise<{ message: string }> => {
  const { email } = input;

  const user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });

  if (!user) {
    // Return success even if user doesn't exist (security)
    return {
      message: 'If an account exists with this email, a password reset link has been sent.',
    };
  }

  const resetToken = uuidv4();
  const tokenExpiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.user.update({
    where: { id: user.id },
    data: {
      verificationToken: resetToken,
      tokenExpiresAt,
    },
  });

  const resetUrl = `${config.app.clientUrl}/reset-password?token=${resetToken}`;
  const name = user.profile ? `${user.profile.firstName} ${user.profile.lastName}` : 'User';

  await sendEmail({
    to: user.email,
    subject: 'Reset Your Password - 3i Institute',
    template: 'password-reset',
    data: {
      name,
      resetUrl,
      year: new Date().getFullYear(),
    },
  });

  return { message: 'If an account exists with this email, a password reset link has been sent.' };
};

export const resetPassword = async (input: ResetPasswordInput): Promise<{ message: string }> => {
  const { token, password } = input;

  const user = await prisma.user.findUnique({ where: { verificationToken: token } });

  if (!user) {
    throw new ValidationError('Invalid reset token');
  }

  if (user.tokenExpiresAt && user.tokenExpiresAt < new Date()) {
    throw new ValidationError('Reset token has expired');
  }

  const hashedPassword = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      verificationToken: null,
      tokenExpiresAt: null,
    },
  });

  // Invalidate all refresh tokens
  await prisma.refreshToken.deleteMany({ where: { userId: user.id } });

  return { message: 'Password reset successfully. You can now login with your new password.' };
};

export const changePassword = async (
  userId: string,
  input: ChangePasswordInput,
): Promise<{ message: string }> => {
  const { currentPassword, newPassword } = input;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError('User not found');
  }

  const isPasswordValid = await comparePassword(currentPassword, user.password);
  if (!isPasswordValid) {
    throw new ValidationError('Current password is incorrect');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // Invalidate all refresh tokens
  await prisma.refreshToken.deleteMany({ where: { userId } });

  return { message: 'Password changed successfully. Please login again.' };
};

export const logout = async (
  userId: string,
  refreshTokenValue: string,
): Promise<{ message: string }> => {
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      token: refreshTokenValue,
    },
  });

  return { message: 'Logged out successfully' };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
    profile: user.profile,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
  };
};
