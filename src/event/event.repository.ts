import { CreateEventDto } from './dto/create-event.dto';
import { Event, EventKey } from './entities/event.interface';
import { InjectModel, Model } from 'nestjs-dynamoose';

export class EventRepository {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<Event, EventKey>,
  ) {}

  async create(id: string, createEventDto: CreateEventDto, image: string) {
    return await this.eventModel.create({
      id,
      image,
      url: createEventDto.url,
      title: createEventDto.title,
      authority: createEventDto.authority,
      createdAt: new Date(),
    });
  }

  async findByRole(role: string) {
    try {
      const events = await this.eventModel.scan().exec();

      return events
        .filter((event) => {
          return event.authority.has(role);
        })
        .sort((a, b) => {
          return a.createdAt.getTime() - b.createdAt.getTime();
        });
    } catch (error) {
      throw new Error(`event.repository > findByRole > ${error.message} > `);
    }
  }
}
