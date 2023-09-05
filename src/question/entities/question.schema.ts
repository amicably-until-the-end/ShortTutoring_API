import { Schema } from 'dynamoose';

export const ProblemSchema = new Schema({
  mainImage: {
    type: String,
  },
  images: {
    type: Array,
    schema: [String],
  },
  description: {
    type: String,
  },
  schoolLevel: {
    type: String,
  },
  schoolSubject: {
    type: String,
  },
});

export const QuestionSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  status: {
    type: String,
    enum: ['pending', 'matched', 'canceled', 'expired', 'completed'],
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
  selectedTeacherId: {
    type: String,
  },
  tutoringId: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  hopeTutoringTime: {
    type: Array,
    schema: [String],
  },
  hopeImmediately: {
    type: Boolean,
    schema: Boolean,
  },
});
