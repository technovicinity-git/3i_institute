import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type { CreateMCQInput, CreateShortQuestionInput, QuestionFilters } from './types';

export const createMCQ = async (teacherId: string, input: CreateMCQInput) => {
  const question = await prisma.question.create({
    data: {
      type: 'MCQ',
      question: input.question,
      options: JSON.stringify(input.options),
      correctAnswer: input.correctAnswer.toString(),
      marks: input.marks,
      courseId: input.courseId,
      createdById: teacherId,
    },
  });

  return {
    ...question,
    options: JSON.parse(question.options),
    correctAnswer: parseInt(question.correctAnswer),
  };
};

export const createShortQuestion = async (teacherId: string, input: CreateShortQuestionInput) => {
  const question = await prisma.question.create({
    data: {
      type: 'SHORT',
      question: input.question,
      suggestedAnswer: input.suggestedAnswer,
      marks: input.marks,
      courseId: input.courseId,
      createdById: teacherId,
    },
  });

  return question;
};

export const getQuestions = async (userId: string, role: string, filters: QuestionFilters) => {
  const { type, courseId, search, page = 1, limit = 20 } = filters;

  const where: any = {};

  if (role === 'TEACHER') {
    where.OR = [{ createdById: userId }, { createdBy: { role: 'ADMIN' } }];
  }

  if (type) where.type = type;
  if (courseId) where.courseId = courseId;
  if (search) {
    where.question = { contains: search, mode: 'insensitive' };
  }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      where,
      select: {
        id: true,
        type: true,
        question: true,
        options: true,
        marks: true,
        courseId: true,
        createdAt: true,
        createdBy: {
          select: {
            id: true,
            profile: { select: { firstName: true, lastName: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.question.count({ where }),
  ]);

  const formattedQuestions = questions.map((q) => ({
    ...q,
    options: q.options ? JSON.parse(q.options) : null,
  }));

  return {
    questions: formattedQuestions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
};

export const getQuestionById = async (id: string) => {
  const question = await prisma.question.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          id: true,
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!question) throw new NotFoundError('Question not found');

  return {
    ...question,
    options: question.options ? JSON.parse(question.options) : null,
    correctAnswer: question.correctAnswer ? parseInt(question.correctAnswer) : null,
  };
};

export const updateQuestion = async (id: string, teacherId: string, input: any) => {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) throw new NotFoundError('Question not found');
  if (question.createdById !== teacherId)
    throw new ValidationError('You can only edit your own questions');

  const updateData: any = { ...input };
  if (input.options) updateData.options = JSON.stringify(input.options);
  if (input.correctAnswer !== undefined) updateData.correctAnswer = input.correctAnswer.toString();

  const updated = await prisma.question.update({
    where: { id },
    data: updateData,
  });

  return {
    ...updated,
    options: updated.options ? JSON.parse(updated.options) : null,
    correctAnswer: updated.correctAnswer ? parseInt(updated.correctAnswer) : null,
  };
};

export const deleteQuestion = async (id: string, teacherId: string) => {
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) throw new NotFoundError('Question not found');
  if (question.createdById !== teacherId)
    throw new ValidationError('You can only delete your own questions');

  await prisma.question.delete({ where: { id } });
  return { message: 'Question deleted successfully' };
};
