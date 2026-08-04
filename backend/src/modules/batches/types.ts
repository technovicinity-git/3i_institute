export interface CreateBatchInput {
  courseId: string;
  name: string;
  capacity: number;
  sessions: CreateSessionInput[];
}

export interface UpdateBatchInput {
  name?: string;
  capacity?: number;
  isClosed?: boolean;
}

export interface CreateSessionInput {
  title: string;
  date: string;
  time: string;
  notes?: string;
}

export interface UpdateSessionInput {
  title?: string;
  date?: string;
  time?: string;
  notes?: string;
  isCompleted?: boolean;
}
