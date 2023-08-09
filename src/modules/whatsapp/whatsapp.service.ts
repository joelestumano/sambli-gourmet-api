import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { create, Message, Whatsapp } from 'venom-bot';
import { OpenaiService } from '../openai/openai.service';
import { DtoWhatsappProfileName } from './dtos/whatsapp-profile-name.dto';
import { DtoWhatsappProfileStatus } from './dtos/whatsapp-profile-status.dto';

class Client {
    whatsapp: Whatsapp;
    constructor(whatsapp: Whatsapp) {
        this.whatsapp = whatsapp;
    }
}

@Injectable()
export class WhatsappService {

    private client: Client = null;

    constructor(private readonly openaiService: OpenaiService) {
        create({
            session: 'session-sambli-gourmet-api',
            autoClose: 0,
        }).then(async (whatsapp: Whatsapp) => {
            this.client = new Client(whatsapp);
            return await this.start(this.client);
        }).catch((error) => {
            console.error('error: ', error);
        });
    }

    private async start(client: Client) {
        client.whatsapp.onMessage(async (message: Message) => {
            if (message.body && !message.isGroupMsg) {
                this.openaiService.loadChat(message).then(async (response) => {

                    return await client.whatsapp.sendText(message.chatId, `👱‍♀️ ${response}`)
                        .then((result) => result)
                        .catch((error) => error);

                    /* return await client.whatsapp.reply(message.chatId, `👱‍♀️ ${response}`, message.id)
                        .then((result) => result)
                        .catch((error) => error); */

                    /* return await client.whatsapp.sendImage(message.chatId, 'src\\temp\\banner.jpg', 'Banner', 'Caption')
                        .then((result) => result)
                        .catch((error) => error); */

                    /* return await client.whatsapp.sendLocation(message.chatId, '-1.722247', '-48.879224', 'Location')
                        .then((result) => result)
                        .catch((error) => error); */

                });
            }
        });
    }

    async setProfileStatus(dto: DtoWhatsappProfileStatus): Promise<void> {
        if (this.client) {
            await this.client.whatsapp.setProfileStatus(dto.profileStatus);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfileName(dto: DtoWhatsappProfileName): Promise<void> {
        if (this.client) {
            await this.client.whatsapp.setProfileName(dto.profileName);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfilePic(file: Express.Multer.File): Promise<void> {
        if (this.client) {
            const filePath = `src/temp/${file.originalname}`;
            await this.client.whatsapp.setProfilePic(filePath).then(() => {
                const fs = require('fs');
                fs.unlinkSync(filePath, (err: any) => {
                    if (err) {
                        new InternalServerErrorException(err);
                    }
                })
            });
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }
}
