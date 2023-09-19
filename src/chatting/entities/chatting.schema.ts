import { Schema } from 'dynamoose';

export const ChattingMessageSchema = new Schema({
  sender: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});

export const ChattingSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  studentId: {
    type: String,
  },
  teacherId: {
    type: String,
  },
  questionId: {
    type: String,
  },
  messages: {
    type: Array,
    schema: [ChattingMessageSchema],
  },
});
