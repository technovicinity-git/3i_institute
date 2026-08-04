export interface CertificateData {
  id: string;
  type: 'ATTENDANCE' | 'COMPLETION';
  courseName: string;
  studentName: string;
  issueDate: Date;
  certificateNumber: string;
}
