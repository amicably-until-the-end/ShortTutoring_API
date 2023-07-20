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
  profileImageURL: {
    type: String,
  },
  role: {
    type: String,
  },
  createdAt: {
    type: String,
  },
});
