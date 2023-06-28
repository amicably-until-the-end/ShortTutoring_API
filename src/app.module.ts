import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { RequestsModule } from './requests/requests.module';
import { TutoringsModule } from './tutorings/tutorings.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [UsersModule, RequestsModule, TutoringsModule, ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
