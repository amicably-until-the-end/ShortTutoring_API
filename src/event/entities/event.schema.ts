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
  title: {
    type: String,
  },
  authority: {
    type: Set,
    schema: [String],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});
