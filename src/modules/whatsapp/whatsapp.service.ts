import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { create, Message, Whatsapp } from 'venom-bot';
import { OpenaiService } from '../openai/openai.service';
import { DtoWhatsappProfileName } from './dtos/whatsapp-profile-name.dto';
import { DtoWhatsappProfileStatus } from './dtos/whatsapp-profile-status.dto';

class Client {
    constructor(private readonly whatsapp: Whatsapp) { }
    getWhatsapp(): Whatsapp {
        return this.whatsapp;
    }
}

@Injectable()
export class WhatsappService {

    private readonly logger = new Logger(WhatsappService.name);
    private client: Client;

    constructor(private readonly openaiService: OpenaiService) {
        create({
            session: 'session-sg-api',
            autoClose: 0,
        }).then(async (whatsapp: Whatsapp) => {
            this.client = new Client(whatsapp);
            return await this.start(this.client);
        }).catch((error) => {
            throw new InternalServerErrorException(error);
        });
    }

    private async start(client: Client): Promise<void> {
        client.getWhatsapp().onMessage(async (message: Message) => {
            if (message.body && !message.isGroupMsg) {
                this.openaiService.loadChat(message).then(async (content) => {

                    this.logger.log(message.body);

                    return await client.getWhatsapp().sendText(message.chatId, `👱‍♀️ ${content}`)
                        .then((result: any) => {
                            this.logger.log(result.text);
                            return result;
                        })
                        .catch((error) => error);

                    /* return await client.getWhatsapp().reply(message.chatId, `👱‍♀️ ${content}`, message.id)
                        .then((result) => result)
                        .catch((error) => error); */

                    /* return await client.getWhatsapp().sendImage(message.chatId, 'src\\temp\\banner.jpg', 'Banner', 'Caption')
                        .then((result) => result)
                        .catch((error) => error); */

                    /* return await client.getWhatsapp().sendLocation(message.chatId, '-1.722247', '-48.879224', 'Location')
                        .then((result) => result)
                        .catch((error) => error); */

                });
            }
        });
    }

    async setProfileStatus(dto: DtoWhatsappProfileStatus): Promise<void> {
        if (this.client) {
            await this.client.getWhatsapp().setProfileStatus(dto.profileStatus);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfileName(dto: DtoWhatsappProfileName): Promise<void> {
        if (this.client) {
            await this.client.getWhatsapp().setProfileName(dto.profileName);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfilePic(file: Express.Multer.File): Promise<void> {
        if (this.client) {
            const filePath = `src/temp/${file.originalname}`;
            await this.client.getWhatsapp().setProfilePic(filePath).then(() => {
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
