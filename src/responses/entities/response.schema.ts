import { Schema } from 'dynamoose';

export const ResponseSchema = new Schema({
  request_id: {
    type: String,
  },
  student_id: {
    type: String,
  },
  teacher_ids: {
    type: Array,
    schema: [String],
  },
});
