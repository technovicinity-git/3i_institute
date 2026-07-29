export interface CreateTopicInput {
  name: string;
  description?: string;
}

export interface UpdateTopicInput {
  name?: string;
  description?: string;
  isActive?: boolean;
}
