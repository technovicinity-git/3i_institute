export interface UploadMaterialInput {
  courseId: string;
  title: string;
  description?: string;
  type: 'VIDEO' | 'PDF' | 'AUDIO' | 'IMAGE' | 'DOCUMENT';
  url: string;
  duration?: number;
  order?: number;
}
