import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type { UploadMaterialInput } from './types';

export const uploadMaterial = async (teacherId: string, input: UploadMaterialInput) => {
  const course = await prisma.course.findUnique({ where: { id: input.courseId } });
  if (!course) throw new NotFoundError('Course not found');
  if (course.teacherId !== teacherId)
    throw new ValidationError('You can only add materials to your own courses');

  const material = await prisma.courseMaterial.create({
    data: {
      courseId: input.courseId,
      title: input.title,
      description: input.description,
      type: input.type,
      url: input.url,
      duration: input.duration,
      order: input.order || 0,
    },
  });

  return material;
};

export const getCourseMaterials = async (courseId: string) => {
  const materials = await prisma.courseMaterial.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
  });

  return materials;
};

export const getMaterialById = async (id: string) => {
  const material = await prisma.courseMaterial.findUnique({
    where: { id },
    include: {
      course: {
        select: { id: true, title: true, teacherId: true },
      },
    },
  });

  if (!material) throw new NotFoundError('Material not found');
  return material;
};

export const updateMaterial = async (
  id: string,
  teacherId: string,
  input: Partial<UploadMaterialInput>,
) => {
  const material = await prisma.courseMaterial.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!material) throw new NotFoundError('Material not found');
  if (material.course.teacherId !== teacherId)
    throw new ValidationError('You can only update your own materials');

  const updatedMaterial = await prisma.courseMaterial.update({
    where: { id },
    data: input,
  });

  return updatedMaterial;
};

export const deleteMaterial = async (id: string, teacherId: string) => {
  const material = await prisma.courseMaterial.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!material) throw new NotFoundError('Material not found');
  if (material.course.teacherId !== teacherId)
    throw new ValidationError('You can only delete your own materials');

  await prisma.courseMaterial.delete({ where: { id } });
  return { message: 'Material deleted successfully' };
};

export const updateVideoProgress = async (userId: string, materialId: string, position: number) => {
  const material = await prisma.courseMaterial.findUnique({ where: { id: materialId } });
  if (!material) throw new NotFoundError('Material not found');

  const progress = await prisma.videoProgress.upsert({
    where: {
      userId_materialId: { userId, materialId },
    },
    create: {
      userId,
      materialId,
      lastPosition: position,
      watched: false,
    },
    update: {
      lastPosition: position,
    },
  });

  return progress;
};

export const getVideoProgress = async (userId: string, materialId: string) => {
  const progress = await prisma.videoProgress.findUnique({
    where: {
      userId_materialId: { userId, materialId },
    },
  });

  return progress;
};

export const markVideoWatched = async (userId: string, materialId: string) => {
  const progress = await prisma.videoProgress.upsert({
    where: {
      userId_materialId: { userId, materialId },
    },
    create: {
      userId,
      materialId,
      lastPosition: 0,
      watched: true,
    },
    update: {
      watched: true,
    },
  });

  return progress;
};
