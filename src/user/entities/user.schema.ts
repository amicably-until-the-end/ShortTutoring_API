import { Schema } from 'dynamoose';

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
  profileImage: {
    type: String,
  },
  role: {
    type: String,
  },
  createdAt: {
    type: String,
  },
  following: {
    type: Array,
  },
  followers: {
    type: Array,
  },
  school: {
    type: Object,
    schema: {
      level: {
        type: String,
      },
      name: {
        type: String,
      },
      division: {
        type: String,
      },
      department: {
        type: String,
      },
      grade: {
        type: Number,
      },
    },
  },
});
