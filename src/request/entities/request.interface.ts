export interface RequestKey {
  id: string;
}

export interface Problem {
  description: string;
  imageUrl: string;
  schoolLevel: string;
  schoolSubject: string;
  schoolChapter: string;
  difficulty: string;
}

export interface Request extends RequestKey {
  studentId?: string;
  teacherIds?: string[];
  problem?: Problem;
  status?: string;
  tutoringId?: string;
  createdAt?: string;
}
