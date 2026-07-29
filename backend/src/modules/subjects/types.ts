export interface CreateSubjectInput {
  name: string;
  description?: string;
  topicId: string;
}

export interface UpdateSubjectInput {
  name?: string;
  description?: string;
  topicId?: string;
  isActive?: boolean;
}
