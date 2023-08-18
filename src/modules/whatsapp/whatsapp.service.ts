import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { create, Message, Whatsapp } from 'venom-bot';
import { OpenaiBotMessage, OpenaiService, WhatsappMessageType } from '../openai/openai.service';
import { DtoWhatsappProfileName } from './dtos/whatsapp-profile-name.dto';
import { DtoWhatsappProfileStatus } from './dtos/whatsapp-profile-status.dto';

class WhatsappRefApi {
    constructor(private readonly whatsapp: Whatsapp) { }
    getInstance(): Whatsapp {
        return this.whatsapp;
    }
}

@Injectable()
export class WhatsappService {

    private readonly logger = new Logger(WhatsappService.name);
    private whatsappRefApi: WhatsappRefApi;

    constructor(private readonly openaiService: OpenaiService) {
        create({
            session: 'session-sg-api',
            autoClose: 0,
        }).then(async (whatsapp: Whatsapp) => {
            this.whatsappRefApi = new WhatsappRefApi(whatsapp);
            return await this.start(this.whatsappRefApi);
        }).catch((error) => {
            throw new InternalServerErrorException(error);
        });
    }

    private async start(whatsappRefApi: WhatsappRefApi): Promise<void> {
        whatsappRefApi.getInstance().onMessage(async (message: Message) => {

            if (message.body && !message.isGroupMsg && !message.isMedia && message.type === 'chat') {

                this.logger.log(message.body);

                this.openaiService.botMessage(message).then(async (botMessage: OpenaiBotMessage) => {

                    this.logger.log(botMessage.response);

                    switch (botMessage.type) {
                        case WhatsappMessageType.text:
                            return await whatsappRefApi.getInstance().sendText(message.chatId, `👱‍♀️ ${botMessage.response}`)
                                .then((result) => result)
                                .catch((error) => error);

                        case WhatsappMessageType.reply:
                            return await whatsappRefApi.getInstance().reply(message.chatId, `👱‍♀️ ${botMessage.response}`, message.id)
                                .then((result) => result)
                                .catch((error) => error);

                        case WhatsappMessageType.image:
                            return await whatsappRefApi.getInstance().sendImage(message.chatId, 'src\\temp\\banner.jpg', 'Banner', 'Caption')
                                .then((result) => result)
                                .catch((error) => error);

                        case WhatsappMessageType.location:
                            return await whatsappRefApi.getInstance().sendLocation(message.chatId, '-1.722247', '-48.879224', 'Location')
                                .then((result) => result)
                                .catch((error) => error);
                    }
                });

            }
        });
    }

    async setProfileStatus(dto: DtoWhatsappProfileStatus): Promise<void> {
        if (this.whatsappRefApi) {
            await this.whatsappRefApi.getInstance().setProfileStatus(dto.profileStatus);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfileName(dto: DtoWhatsappProfileName): Promise<void> {
        if (this.whatsappRefApi) {
            await this.whatsappRefApi.getInstance().setProfileName(dto.profileName);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfilePic(file: Express.Multer.File): Promise<void> {
        if (this.whatsappRefApi) {
            const filePath = `src/temp/${file.originalname}`;
            await this.whatsappRefApi.getInstance().setProfilePic(filePath).then(() => {
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
