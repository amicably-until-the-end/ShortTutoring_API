import {
  DynamooseModuleOptions,
  DynamooseOptionsFactory,
} from 'nestjs-dynamoose';
import * as process from 'process';
import * as dotenv from 'dotenv';

dotenv.config();

export class DynamooseConfigService implements DynamooseOptionsFactory {
  createDynamooseOptions(): DynamooseModuleOptions {
    return {
      aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
      },
    };
  }
}
