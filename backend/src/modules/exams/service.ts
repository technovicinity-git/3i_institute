import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';
import type { CreateExamInput, SubmitExamInput } from './types';

export const createExam = async (teacherId: string, input: CreateExamInput) => {
  const course = await prisma.course.findUnique({ where: { id: input.courseId } });
  if (!course) throw new NotFoundError('Course not found');
  if (course.teacherId !== teacherId)
    throw new ValidationError('You can only create exams for your own courses');

  const totalQuestionMarks = input.questions.reduce((sum, q) => sum + q.marks, 0);
  if (totalQuestionMarks !== input.totalMarks) {
    throw new ValidationError(
      `Total marks (${input.totalMarks}) must equal sum of question marks (${totalQuestionMarks})`,
    );
  }

  const exam = await prisma.examPaper.create({
    data: {
      courseId: input.courseId,
      title: input.title,
      duration: input.duration,
      passingMarks: input.passingMarks,
      totalMarks: input.totalMarks,
      isFinalExam: input.isFinalExam || false,
      randomOrder: input.randomOrder || false,
      examQuestions: {
        create: input.questions.map((q) => ({
          questionId: q.questionId,
          marks: q.marks,
        })),
      },
    },
    include: {
      examQuestions: {
        include: {
          question: true,
        },
      },
    },
  });

  return exam;
};

export const getCourseExams = async (courseId: string) => {
  const exams = await prisma.examPaper.findMany({
    where: { courseId },
    include: {
      _count: {
        select: { examQuestions: true, studentExams: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return exams;
};

export const getExamById = async (id: string) => {
  const exam = await prisma.examPaper.findUnique({
    where: { id },
    include: {
      course: {
        select: { id: true, title: true },
      },
      examQuestions: {
        include: {
          question: {
            select: {
              id: true,
              type: true,
              question: true,
              options: true,
              marks: true,
            },
          },
        },
      },
      _count: {
        select: { studentExams: true },
      },
    },
  });

  if (!exam) throw new NotFoundError('Exam not found');

  return {
    ...exam,
    examQuestions: exam.examQuestions.map((eq) => ({
      ...eq,
      question: {
        ...eq.question,
        options: eq.question.options ? JSON.parse(eq.question.options) : null,
        correctAnswer: undefined, // Don't send correct answer to students
      },
    })),
  };
};

export const getExamForStudent = async (examId: string, userId: string) => {
  const exam = await prisma.examPaper.findUnique({
    where: { id: examId },
    include: {
      course: {
        select: { id: true, title: true },
      },
      examQuestions: {
        include: {
          question: {
            select: {
              id: true,
              type: true,
              question: true,
              options: true,
              marks: true,
            },
          },
        },
      },
    },
  });

  if (!exam) throw new NotFoundError('Exam not found');

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId, courseId: exam.courseId },
    },
  });

  if (!enrollment)
    throw new ValidationError('You must be enrolled in the course to take this exam');

  const existingAttempt = await prisma.studentExam.findFirst({
    where: { userId, examPaperId: examId },
  });

  if (existingAttempt) throw new ValidationError('You have already taken this exam');

  let questions = exam.examQuestions.map((eq) => ({
    id: eq.question.id,
    type: eq.question.type,
    question: eq.question.question,
    options: eq.question.options ? JSON.parse(eq.question.options) : null,
    marks: eq.marks,
  }));

  if (exam.randomOrder) {
    questions = questions.sort(() => Math.random() - 0.5);
  }

  return {
    id: exam.id,
    title: exam.title,
    courseId: exam.courseId,
    courseName: exam.course.title,
    duration: exam.duration,
    totalMarks: exam.totalMarks,
    passingMarks: exam.passingMarks,
    isFinalExam: exam.isFinalExam,
    questions,
  };
};

export const submitExam = async (userId: string, input: SubmitExamInput) => {
  const exam = await prisma.examPaper.findUnique({
    where: { id: input.examPaperId },
    include: {
      examQuestions: {
        include: { question: true },
      },
    },
  });

  if (!exam) throw new NotFoundError('Exam not found');

  const existingAttempt = await prisma.studentExam.findFirst({
    where: { userId, examPaperId: input.examPaperId },
  });

  if (existingAttempt) throw new ValidationError('You have already submitted this exam');

  let totalScore = 0;

  for (const answer of input.answers) {
    const examQuestion = exam.examQuestions.find((eq) => eq.questionId === answer.questionId);
    if (!examQuestion) continue;

    if (examQuestion.question.type === 'MCQ') {
      if (examQuestion.question.correctAnswer === answer.answer) {
        totalScore += examQuestion.marks;
      }
    }
  }

  const studentExam = await prisma.studentExam.create({
    data: {
      userId,
      examPaperId: input.examPaperId,
      score: totalScore,
      reviewed: false,
    },
    include: {
      examPaper: true,
    },
  });

  const needsReview = exam.examQuestions.some((eq) => eq.question.type === 'SHORT');

  return {
    exam: studentExam,
    message: needsReview
      ? 'Exam submitted. Short answer questions need review.'
      : `Exam submitted. Your score: ${totalScore}/${exam.totalMarks}`,
    passed: totalScore >= exam.passingMarks,
  };
};

export const getStudentExams = async (userId: string) => {
  const exams = await prisma.studentExam.findMany({
    where: { userId },
    include: {
      examPaper: {
        select: {
          id: true,
          title: true,
          totalMarks: true,
          passingMarks: true,
          courseId: true,
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return exams;
};

export const getExamResults = async (examId: string, teacherId: string) => {
  const exam = await prisma.examPaper.findUnique({
    where: { id: examId },
    include: { course: true },
  });

  if (!exam) throw new NotFoundError('Exam not found');
  if (exam.course.teacherId !== teacherId) throw new ValidationError('Not authorized');

  const results = await prisma.studentExam.findMany({
    where: { examPaperId: examId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          profile: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
    orderBy: { submittedAt: 'desc' },
  });

  return results;
};

export const reviewAnswer = async (
  studentExamId: string,
  questionId: string,
  teacherId: string,
  marks: number,
) => {
  const studentExam = await prisma.studentExam.findUnique({
    where: { id: studentExamId },
    include: {
      examPaper: {
        include: {
          course: true,
          examQuestions: {
            include: { question: true },
          },
        },
      },
    },
  });

  if (!studentExam) throw new NotFoundError('Student exam not found');
  if (studentExam.examPaper.course.teacherId !== teacherId)
    throw new ValidationError('Not authorized');

  const examQuestion = studentExam.examPaper.examQuestions.find(
    (eq) => eq.questionId === questionId,
  );
  if (!examQuestion) throw new NotFoundError('Question not found in this exam');

  if (marks > examQuestion.marks) {
    throw new ValidationError(`Marks cannot exceed ${examQuestion.marks}`);
  }

  const currentScore = studentExam.score || 0;
  const newScore = currentScore + marks;

  const updated = await prisma.studentExam.update({
    where: { id: studentExamId },
    data: {
      score: newScore,
    },
  });

  return {
    exam: updated,
    message: 'Answer reviewed successfully',
  };
};

export const deleteExam = async (id: string, teacherId: string) => {
  const exam = await prisma.examPaper.findUnique({
    where: { id },
    include: { course: true },
  });

  if (!exam) throw new NotFoundError('Exam not found');
  if (exam.course.teacherId !== teacherId) throw new ValidationError('Not authorized');

  await prisma.examPaper.delete({ where: { id } });
  return { message: 'Exam deleted successfully' };
};
