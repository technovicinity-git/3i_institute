export interface TeacherFilters {
  search?: string;
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateTeacherProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
  academicInfo?: string;
  professionalExperience?: string;
}
