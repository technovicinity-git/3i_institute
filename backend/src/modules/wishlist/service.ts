import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';

export const addToWishlist = async (userId: string, courseId: string) => {
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course) throw new NotFoundError('Course not found');

  const existing = await prisma.wishlist.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existing) throw new ValidationError('Course already in wishlist');

  await prisma.wishlist.create({
    data: { userId, courseId },
  });

  return { message: 'Course added to wishlist' };
};

export const removeFromWishlist = async (userId: string, courseId: string) => {
  const existing = await prisma.wishlist.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!existing) throw new NotFoundError('Course not in wishlist');

  await prisma.wishlist.delete({
    where: { userId_courseId: { userId, courseId } },
  });

  return { message: 'Course removed from wishlist' };
};

export const getWishlist = async (userId: string) => {
  const wishlist = await prisma.wishlist.findMany({
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
        },
      },
    },
    orderBy: { addedAt: 'desc' },
  });

  return wishlist;
};
