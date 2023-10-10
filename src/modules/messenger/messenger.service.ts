import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessengerService {
    constructor(
        private readonly mailerService: MailerService,
        private configService: ConfigService,
    ) { }

    async sendEmail(email: string, subject: string, content: string | Buffer): Promise<any> {
        return new Promise(async (resolve, reject) => {
            await this.mailerService
                .sendMail({
                    to: email,
                    from: `SG <${this.configService.get<string>('mailerConfig.user')}>`,
                    subject: subject,
                    html: content,
                })
                .then((resp) => {
                    resolve(resp);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}