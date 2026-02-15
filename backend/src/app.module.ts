import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GuestbookController } from './guestbook.controller';
import { GuestbookService } from './guestbook.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [GuestbookController], // Must be here!
  providers: [GuestbookService],
})
export class AppModule {}