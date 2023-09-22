export interface TutoringKey {
  id: string;
}

export interface Tutoring extends TutoringKey {
  questionId: string;
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
  RTCAppId?: string;
  reservedStart?: Date;
  reservedEnd?: Date;
}
