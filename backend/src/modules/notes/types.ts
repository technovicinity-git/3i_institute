export interface CreateNoteInput {
  courseId: string;
  title: string;
  content: string;
}

export interface UpdateNoteInput {
  title?: string;
  content?: string;
}
