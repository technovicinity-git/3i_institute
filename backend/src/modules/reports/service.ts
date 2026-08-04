import prisma from '@/config/database';

export const getRevenueReport = async (from?: string, to?: string) => {
  const dateFilter: any = {};
  if (from || to) {
    dateFilter.subscribedAt = {};
    if (from) dateFilter.subscribedAt.gte = new Date(from);
    if (to) dateFilter.subscribedAt.lte = new Date(to);
  }

  const subscriptions = await prisma.subscription.findMany({
    where: { isActive: true, ...dateFilter },
    include: {
      user: {
        select: { email: true },
      },
    },
  });

  const totalRevenue = subscriptions.length * 100; // Assuming $100 per subscription

  return {
    totalSubscriptions: subscriptions.length,
    totalRevenue,
    currency: 'USD',
  };
};

export const getCoursePopularityReport = async () => {
  const courses = await prisma.course.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      _count: { select: { enrollments: true } },
      teacher: {
        select: {
          profile: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { enrollments: { _count: 'desc' } },
    take: 20,
  });

  return courses.map((course) => ({
    id: course.id,
    title: course.title,
    enrollments: course._count.enrollments,
    teacher: course.teacher.profile
      ? `${course.teacher.profile.firstName} ${course.teacher.profile.lastName}`
      : 'Unknown',
  }));
};

export const getStudentGrowthReport = async () => {
  const students = await prisma.user.groupBy({
    by: ['createdAt'],
    where: { role: 'STUDENT' },
    _count: true,
  });

  return students;
};

export const getTeacherStatsReport = async () => {
  const teachers = await prisma.user.findMany({
    where: { role: 'TEACHER', status: 'ACTIVE' },
    select: {
      id: true,
      email: true,
      profile: { select: { firstName: true, lastName: true } },
      _count: { select: { courses: true } },
      courses: {
        select: {
          _count: { select: { enrollments: true } },
        },
      },
    },
  });

  return teachers.map((t) => ({
    id: t.id,
    name: t.profile ? `${t.profile.firstName} ${t.profile.lastName}` : t.email,
    totalCourses: t._count.courses,
    totalEnrollments: t.courses.reduce((sum, c) => sum + c._count.enrollments, 0),
  }));
};

export const getExamStatsReport = async () => {
  const [totalExams, totalSubmissions, avgScore] = await Promise.all([
    prisma.examPaper.count(),
    prisma.studentExam.count(),
    prisma.studentExam.aggregate({
      _avg: { score: true },
    }),
  ]);

  return {
    totalExams,
    totalSubmissions,
    averageScore: Math.round(avgScore._avg.score || 0),
  };
};

export const getDashboardStats = async () => {
  const [
    totalStudents,
    totalTeachers,
    totalCourses,
    totalEnrollments,
    activeSubscriptions,
    pendingTeachers,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'TEACHER', status: 'ACTIVE' } }),
    prisma.course.count({ where: { status: 'PUBLISHED' } }),
    prisma.enrollment.count(),
    prisma.subscription.count({ where: { isActive: true } }),
    prisma.user.count({ where: { role: 'TEACHER', status: 'PENDING' } }),
  ]);

  return {
    totalStudents,
    totalTeachers,
    totalCourses,
    totalEnrollments,
    activeSubscriptions,
    pendingTeachers,
  };
};
