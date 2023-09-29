import { Schema } from 'dynamoose';

export const TutoringSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  questionId: {
    type: String,
  },
  studentId: {
    type: String,
  },
  teacherId: {
    type: String,
  },
  status: {
    type: String,
  },
  matchedAt: {
    type: String,
  },
  startedAt: {
    type: String,
  },
  endedAt: {
    type: String,
  },
  whiteBoardAppId: {
    type: String || null,
  },
  whiteBoardToken: {
    type: String || null,
  },
  whiteBoardUUID: {
    type: String || null,
  },
  teacherRTCToken: {
    type: String || null,
  },
  studentRTCToken: {
    type: String || null,
  },
  RTCAppId: {
    type: String || null,
  },
  reservedStart: {
    type: Date || null,
  },
  reservedEnd: {
    type: Date || null,
  },
});
