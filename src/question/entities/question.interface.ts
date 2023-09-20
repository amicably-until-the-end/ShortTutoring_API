export interface QuestionKey {
  id: string;
}

export interface Problem {
  mainImage?: string;
  images?: string[];
  description: string;
  schoolLevel?: string;
  schoolSubject?: string;
}

export interface Question extends QuestionKey {
  status: string;
  studentId: string;
  teacherIds: string[];
  problem: Problem;
  selectedTeacherId?: string;
  tutoringId: string;
  createdAt?: string;
  isSelect: boolean;
  hopeTutoringTime?: string[];
  hopeImmediately?: boolean;
}
