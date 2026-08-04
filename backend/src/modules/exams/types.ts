export interface CreateExamInput {
  courseId: string;
  title: string;
  duration: number;
  passingMarks: number;
  totalMarks: number;
  isFinalExam?: boolean;
  randomOrder?: boolean;
  questions: {
    questionId: string;
    marks: number;
  }[];
}

export interface SubmitExamInput {
  examPaperId: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
}

export interface ReviewAnswerInput {
  marks: number;
}
