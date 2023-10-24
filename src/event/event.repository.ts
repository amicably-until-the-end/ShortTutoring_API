import { Event, EventKey } from './entities/event.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';

export class EventRepository {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<Event, EventKey>,
  ) {}

  async create(
    eventId: string,
    image: string,
    url: string,
    authority: Set<string>,
  ) {
    return await this.eventModel.create({
      id: eventId,
      image,
      url,
      createdAt: new Date(),
      authority,
    });
  }

  async findByRole(role: string) {
    const events = await this.eventModel.scan().exec();
    events
      .filter((event) => {
        return event.authority.has(role);
      })
      .sort((a, b) => {
        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    return events;
  }
}
