import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';

export const subscribeToPlatform = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const existingSubscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  if (existingSubscription && existingSubscription.isActive) {
    throw new ValidationError('Already subscribed');
  }

  const subscription = await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      isActive: true,
      subscribedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
    },
    update: {
      isActive: true,
      subscribedAt: new Date(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    subscription,
    message: 'Successfully subscribed to the platform',
  };
};

export const checkSubscription = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  return {
    isSubscribed: subscription?.isActive ?? false,
    subscription,
  };
};

export const enrollCourse = async (userId: string, courseId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription || !subscription.isActive) {
    throw new ValidationError('Please subscribe to the platform first');
  }

  if (subscription.expiresAt && subscription.expiresAt < new Date()) {
    await prisma.subscription.update({
      where: { userId },
      data: { isActive: false },
    });
    throw new ValidationError('Subscription has expired. Please renew');
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new NotFoundError('Course not found');
  if (course.status !== 'PUBLISHED') throw new ValidationError('Course is not available');

  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existingEnrollment) throw new ValidationError('Already enrolled in this course');

  const enrollment = await prisma.enrollment.create({
    data: { userId, courseId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          type: true,
          teacher: {
            select: {
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      },
    },
  });

  return {
    enrollment,
    message: 'Successfully enrolled in course',
  };
};

export const getMyEnrollments = async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
          type: true,
          status: true,
          teacher: {
            select: {
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
          _count: {
            select: { enrollments: true },
          },
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  });

  return enrollments;
};

export const unenrollCourse = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!enrollment) throw new NotFoundError('Not enrolled in this course');

  await prisma.enrollment.delete({
    where: { userId_courseId: { userId, courseId } },
  });

  return { message: 'Successfully unenrolled from course' };
};

export const getEnrollmentStats = async () => {
  const [totalEnrollments, totalSubscriptions, activeSubscriptions] = await Promise.all([
    prisma.enrollment.count(),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { isActive: true } }),
  ]);

  return {
    totalEnrollments,
    totalSubscriptions,
    activeSubscriptions,
  };
};
