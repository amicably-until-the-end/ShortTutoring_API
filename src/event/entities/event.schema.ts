import { Schema } from 'dynamoose';

export const EventSchema = new Schema({
  id: {
    type: String,
    hashKey: true,
  },
  image: {
    type: String,
  },
  url: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
