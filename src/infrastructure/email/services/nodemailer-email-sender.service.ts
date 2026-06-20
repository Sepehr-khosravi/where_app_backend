import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IEmailSenderService } from '../../../domain/auth/services/email-sender.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NodemailerEmailSenderService implements IEmailSenderService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    const options: SMTPTransport.Options = {
      host: this.config.get('SMTP_HOST'),
      port: this.config.get('SMTP_PORT'),
      auth: {
        user: this.config.get('SMTP_USER'),
        pass: this.config.get('SMTP_PASS'),
      },
    };

    this.transporter = nodemailer.createTransport(options);
  }

  async sendVerificationCode(email: string, code: string): Promise<void> {
    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM'),
      to: email,
      subject: 'Verification Code',
      text: `Your Verification Code: ${code}`,
    });
  }
}