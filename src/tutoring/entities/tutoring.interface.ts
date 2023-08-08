export interface TutoringKey {
  id: string;
}

export interface Tutoring extends TutoringKey {
  requestId?: string;
  studentId: string;
  teacherId: string;
  status: string;
  matchedAt?: string;
  startedAt?: string;
  endedAt?: string;
  whiteBoardAppId?: string;
  whiteBoardToken?: string;
  whiteBoardUUID?: string;
  teacherRTCToken?: string;
  studentRTCToken?: string;
}
