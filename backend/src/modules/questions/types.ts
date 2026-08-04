export interface CreateMCQInput {
  question: string;
  options: string[];
  correctAnswer: number;
  marks: number;
  courseId?: string;
}

export interface CreateShortQuestionInput {
  question: string;
  suggestedAnswer?: string;
  marks: number;
  courseId?: string;
}

export interface QuestionFilters {
  type?: 'MCQ' | 'SHORT';
  courseId?: string;
  search?: string;
  page?: number;
  limit?: number;
}
