import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type { CreateTopicInput, UpdateTopicInput } from './types';

export const createTopic = async (input: CreateTopicInput) => {
  const existingTopic = await prisma.topic.findUnique({ where: { name: input.name } });
  if (existingTopic) {
    throw new ValidationError('Topic with this name already exists');
  }

  const topic = await prisma.topic.create({ data: input });
  return topic;
};

export const getTopics = async () => {
  const topics = await prisma.topic.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { subjects: true },
      },
    },
  });
  return topics;
};

export const getTopicById = async (id: string) => {
  const topic = await prisma.topic.findUnique({
    where: { id },
    include: {
      subjects: true,
    },
  });

  if (!topic) {
    throw new NotFoundError('Topic not found');
  }

  return topic;
};

export const updateTopic = async (id: string, input: UpdateTopicInput) => {
  const topic = await prisma.topic.findUnique({ where: { id } });
  if (!topic) {
    throw new NotFoundError('Topic not found');
  }

  if (input.name && input.name !== topic.name) {
    const existingTopic = await prisma.topic.findUnique({ where: { name: input.name } });
    if (existingTopic) {
      throw new ValidationError('Topic with this name already exists');
    }
  }

  const updatedTopic = await prisma.topic.update({
    where: { id },
    data: input,
  });

  return updatedTopic;
};

export const deleteTopic = async (id: string) => {
  const topic = await prisma.topic.findUnique({ where: { id } });
  if (!topic) {
    throw new NotFoundError('Topic not found');
  }

  await prisma.topic.delete({ where: { id } });
  return { message: 'Topic deleted successfully' };
};

export const toggleTopicStatus = async (id: string) => {
  const topic = await prisma.topic.findUnique({ where: { id } });
  if (!topic) {
    throw new NotFoundError('Topic not found');
  }

  const updatedTopic = await prisma.topic.update({
    where: { id },
    data: { isActive: !topic.isActive },
  });

  return {
    topic: updatedTopic,
    message: `Topic ${updatedTopic.isActive ? 'activated' : 'deactivated'} successfully`,
  };
};
