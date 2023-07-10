import { Schema } from 'dynamoose';

export const RequestSchema = new Schema({
  id: {
    type: String,
  },
  student_id: {
    type: String,
  },
  problem_description: {
    type: String,
  },
  problem_image_data: {
    type: String,
  },
  problem_school_level: {
    type: String,
  },
  problem_school_subject: {
    type: String,
  },
  problem_school_chapter: {
    type: String,
  },
  problem_difficulty: {
    type: String,
  },
  teacher_ids: {
    type: Array,
    schema: [String],
  },
  created_at: {
    type: String,
  },
});
