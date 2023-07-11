import { Schema } from 'dynamoose';

export const TutoringSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  request_id: {
    type: String,
  },
  student_id: {
    type: String,
  },
  teacher_id: {
    type: String,
  },
  matched_at: {
    type: String,
  },
  started_at: {
    type: String,
  },
  ended_at: {
    type: String,
  },
  status: {
    type: String,
  },
});
