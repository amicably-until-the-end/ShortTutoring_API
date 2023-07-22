export interface RequestKey {
  id: string;
}

export interface Problem {
  image?: string;
  description: string;
  schoolLevel?: string;
  schoolSubject?: string;
  schoolChapter?: string;
  difficulty?: string;
}

export interface Request extends RequestKey {
  status: string;
  studentId: string;
  teacherIds: string[];
  problem: Problem;
  selectedTeacherId?: string;
  tutoringId?: string;
  createdAt?: string;
}
