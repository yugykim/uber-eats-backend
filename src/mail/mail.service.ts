import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/common.constants';
import { EmailVar, MailModuleOptions } from './mail.interfaces';
import FormData = require('form-data');
import got from 'got';

@Injectable()
export class MailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions,
  ) {}

  private async sendEmail(
    subject: string,
    template: string,
    eamilVars: EmailVar[],
  ) {
    const form = new FormData();

    form.append('from', `Yugy from Ubereat <mailgun@${this.options.domain}>`);
    form.append('to', `yugyeongk92@gmail.com`);
    form.append('subject', subject);
    form.append('template', template);
    eamilVars.forEach((eVar) => form.append(`v:${eVar.key}`, eVar.value));

    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
    } catch (error) {
      console.log(error);
    }
  }

  sendVerificationEmail(email: string, code: string) {
    this.sendEmail('verify your email', 'confirm', [
      { key: 'code', value: code },
      { key: 'username', value: email },
    ]);
  }
}
