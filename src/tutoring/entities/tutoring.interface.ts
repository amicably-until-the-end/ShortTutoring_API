export interface TutoringKey {
  id: string;
}

export interface Tutoring extends TutoringKey {
  requestId?: string;
  studentId: string;
  teacherId: string;
  matchedAt?: string;
  whiteBoardToken?: string;
  whiteBoardUUID?: string;
  whiteBoardAppId?: string;
  startedAt?: string;
  endedAt?: string;
  status: string;
}
