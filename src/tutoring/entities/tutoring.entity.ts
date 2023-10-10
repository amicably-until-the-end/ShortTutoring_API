export interface ClassroomInfo {
  boardAppId: string;
  boardUUID: string;
  boardToken: string;
  rtcAppId: string;
  rtcToken: string;
  rtcChannel: string;
  rtcUID: number;
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
