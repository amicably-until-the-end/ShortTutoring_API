import { Schema } from 'dynamoose';

export const TeacherInfoSchema = new Schema({
  id: {
    type: String,
  },
  school_name: {
    type: String,
  },
  division: {
    type: String,
  },
  department: {
    type: String,
  },
  year: {
    type: Number,
  },
});

export const StudentInfoSchema = new Schema({
  id: {
    type: String,
  },
  school_level: {
    type: String,
  },
  school_grade: {
    type: Number,
  },
});

export const UserSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
  },
  bio: {
    type: String,
  },
  profileImageURL: {
    type: String,
  },
  role: {
    type: String,
  },
  created_at: {
    type: String,
  },
  // student_info: {
  //   type: StudentInfoSchema,
  // },
  // teacher_info: {
  //   type: TeacherInfoSchema,
  // },
  // review_list: {
  //   type: Array,
  // },
});
