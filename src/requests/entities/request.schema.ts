import { Schema } from 'dynamoose';

export const ProblemSchema = new Schema({
  description: {
    type: String,
  },
  image_url: {
    type: String,
  },
  school_level: {
    type: String,
  },
  school_subject: {
    type: String,
  },
  school_chapter: {
    type: String,
  },
  difficulty: {
    type: String,
  },
});

export const RequestSchema = new Schema({
  id: {
    type: String,
  },
  student_id: {
    type: String,
  },
  problem: {
    type: Object,
    schema: ProblemSchema,
  },
  teacher_ids: {
    type: Array,
    schema: [String],
  },
  status: {
    type: String,
  },
  created_at: {
    type: String,
  },
});
