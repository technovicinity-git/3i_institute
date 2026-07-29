export interface StudentFilters {
  search?: string;
  status?: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateStudentProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  city?: string;
  country?: string;
}
