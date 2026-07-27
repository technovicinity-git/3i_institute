import { UserRole, AccountStatus } from '@prisma/client';

export interface RegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: UserRole;
    status: AccountStatus;
    emailVerified: boolean;
    profile?: {
      firstName: string;
      lastName: string;
    } | null;
  };
  accessToken: string;
  refreshToken: string;
}
