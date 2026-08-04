import prisma from '@/config/database';
import { NotFoundError, ValidationError } from '@/common/errors';

export const getMyCertificates = async (userId: string) => {
  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
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
    orderBy: { issuedAt: 'desc' },
  });

  return certificates;
};

export const getCertificateById = async (id: string, userId: string) => {
  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: {
      course: {
        select: {
          id: true,
          title: true,
          description: true,
          teacher: {
            select: {
              profile: {
                select: { firstName: true, lastName: true },
              },
            },
          },
        },
      },
      user: {
        select: {
          profile: {
            select: { firstName: true, lastName: true },
          },
        },
      },
    },
  });

  if (!certificate) throw new NotFoundError('Certificate not found');
  if (certificate.userId !== userId) throw new ValidationError('Not authorized');

  return certificate;
};

export const getAttendanceCertificate = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!enrollment) throw new ValidationError('Not enrolled in this course');

  const existingCertificate = await prisma.certificate.findFirst({
    where: { userId, courseId, type: 'ATTENDANCE' },
  });

  if (existingCertificate) return existingCertificate;

  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      type: 'ATTENDANCE',
      certificateNumber: `ATT-${Date.now()}-${userId.slice(0, 8)}`,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return certificate;
};

export const getCompletionCertificate = async (userId: string, courseId: string) => {
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (!enrollment) throw new ValidationError('Not enrolled in this course');

  // Check if there's a final exam and if student passed
  const finalExam = await prisma.examPaper.findFirst({
    where: { courseId, isFinalExam: true },
  });

  if (finalExam) {
    const studentExam = await prisma.studentExam.findFirst({
      where: { userId, examPaperId: finalExam.id },
    });

    if (!studentExam) throw new ValidationError('Must complete the final exam first');
    if (!studentExam.reviewed) throw new ValidationError('Final exam not yet reviewed');

    const score = studentExam.score || 0;
    if (score < finalExam.passingMarks) {
      throw new ValidationError('Did not pass the final exam');
    }
  }

  const existingCertificate = await prisma.certificate.findFirst({
    where: { userId, courseId, type: 'COMPLETION' },
  });

  if (existingCertificate) return existingCertificate;

  const certificate = await prisma.certificate.create({
    data: {
      userId,
      courseId,
      type: 'COMPLETION',
      certificateNumber: `CMP-${Date.now()}-${userId.slice(0, 8)}`,
    },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  return certificate;
};

export const getStudentCertificates = async (studentId: string) => {
  const student = await prisma.user.findFirst({
    where: { id: studentId, role: 'STUDENT' },
  });

  if (!student) throw new NotFoundError('Student not found');

  const certificates = await prisma.certificate.findMany({
    where: { userId: studentId },
    include: {
      course: {
        select: { id: true, title: true },
      },
    },
    orderBy: { issuedAt: 'desc' },
  });

  return certificates;
};
