import { Schema } from 'dynamoose';

export const AuthSchema = new Schema({
  vendor: {
    type: String,
    hashKey: true,
  },
  authId: {
    type: String,
    rangeKey: true,
  },
  userId: {
    type: String,
  },
  role: {
    type: String,
  },
});
