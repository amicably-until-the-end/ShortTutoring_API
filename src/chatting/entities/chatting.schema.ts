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
  participants: {
    type: Set,
    schema: [String],
  },
  logs: {
    type: Array,
    schema: [ChattingMessageSchema],
  },
});
