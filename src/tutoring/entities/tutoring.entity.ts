export interface ClassroomInfo {
  boardAppId: string;
  boardUUID: string;
  boardToken: string;
  rtcAppId: string;
  rtcToken: string;
}

export interface TutoringInfo {
  id: string;
  questionId: string;
  studentId: string;
  teacherId: string;
  status: string;
  reservedStart: Date;
  reservedEnd: Date;
}
