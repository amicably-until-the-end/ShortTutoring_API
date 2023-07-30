import { Schema } from 'dynamoose';

export const UserSchema = new Schema({
  vendor: {
    type: String,
    hashKey: true,
  },
  id: {
    type: String,
    rangeKey: true,
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
});
