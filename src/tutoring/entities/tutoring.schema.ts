import { Schema } from 'dynamoose';

export const TutoringSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  requestId: {
    type: String,
  },
  studentId: {
    type: String,
  },
  teacherId: {
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
  status: {
    type: String,
  },
  whiteBoardToken: {
    type: String,
  },
  whiteBoardUUID: {
    type: String,
  },
  whiteBoardAppId: {
    type: String,
  },
});
