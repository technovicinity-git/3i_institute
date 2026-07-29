export interface CreateCourseInput {
  title: string;
  description?: string;
  thumbnail?: string;
  coverImage?: string;
  topicId?: string;
  subjectId?: string;
  type?: 'REGULAR' | 'ONLINE' | 'MIXED';
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  thumbnail?: string;
  coverImage?: string;
  topicId?: string;
  subjectId?: string;
  type?: 'REGULAR' | 'ONLINE' | 'MIXED';
  status?: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED';
}

export interface CourseFilters {
  search?: string;
  type?: 'REGULAR' | 'ONLINE' | 'MIXED';
  status?: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED';
  topicId?: string;
  subjectId?: string;
  teacherId?: string;
  page?: number;
  limit?: number;
}
