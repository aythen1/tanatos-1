import { Module } from '@nestjs/common';
import { EmailService } from './mail.service';
import { EmailController } from './mail.controller';

@Module({
  controllers: [EmailController],
  providers: [EmailService],
})
export class MailModule {}
