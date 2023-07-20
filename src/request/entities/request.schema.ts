import { Schema } from 'dynamoose';

export const ProblemSchema = new Schema({
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  schoolLevel: {
    type: String,
  },
  schoolSubject: {
    type: String,
  },
  schoolChapter: {
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
  studentId: {
    type: String,
  },
  problem: {
    type: Object,
    schema: ProblemSchema,
  },
  teacherIds: {
    type: Array,
    schema: [String],
  },
  status: {
    type: String,
  },
  selectedTeacherId: {
    type: String,
  },
  tutoringId: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});
