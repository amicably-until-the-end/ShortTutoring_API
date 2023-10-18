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
    type: String,
  },
  whiteBoardToken: {
    type: String,
  },
  whiteBoardUUID: {
    type: String,
  },
  teacherRTCToken: {
    type: String,
  },
  studentRTCToken: {
    type: String,
  },
  RTCAppId: {
    type: String,
  },
  reservedStart: {
    type: Date,
  },
  reservedEnd: {
    type: Date,
  },
  reviewRating: {
    type: Number,
  },
  reviewComment: {
    type: String,
  },
  recordingResourceId: {
    type: String,
  },
  recordingSid: {
    type: String,
  },
  recordingFilePath: {
    type: Array,
    schema: [String],
  },
});
