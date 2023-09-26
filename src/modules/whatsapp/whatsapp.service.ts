import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { create, Message, Whatsapp } from 'venom-bot';
import { OpenaiBotMessage, OpenaiService, WhatsappMessageType } from '../openai/openai.service';
import { DtoWhatsappProfileName } from './dtos/whatsapp-profile-name.dto';
import { DtoWhatsappProfileStatus } from './dtos/whatsapp-profile-status.dto';
import { DtoWhatsappSessionName } from './dtos/whatsapp-session-name.dto';

@Injectable()
export class WhatsappService {

    private readonly logger = new Logger(WhatsappService.name);
    private whatsappRef: Whatsapp;

    constructor(private readonly openaiService: OpenaiService) { }

    async createSession(dto: DtoWhatsappSessionName): Promise<any> {
        return new Promise((resolve, reject) => {
            let session_;
            create(
                dto.sessionName,
                (base64Qr, asciiQR, attempts, urlCode) => {
                    resolve(base64Qr);
                },
                (statusSession, session) => {
                    session_ = {
                        statusSession: statusSession,
                        sessionName: session
                    }
                },
                {
                    logQR: false,
                    addBrowserArgs: ['--user-agent'],
                }
            ).then(async (whatsapp: Whatsapp) => {
                this.whatsappRef = whatsapp;
                resolve(session_);
                return await this.start(this.whatsappRef);
            }).catch((error) => {
                throw new InternalServerErrorException(error);
            });
        })
    }

    private async start(whatsappRef: Whatsapp): Promise<void> {
        whatsappRef.onMessage(async (message: Message) => {

            if (message.body && !message.isGroupMsg && !message.isMedia && message.type === 'chat') {

                this.logger.log(message.body);

                this.openaiService.botMessage(message).then(async (botMessage: OpenaiBotMessage) => {

                    this.logger.log(botMessage.response);

                    switch (botMessage.type) {
                        case WhatsappMessageType.text:
                            return await whatsappRef.sendText(message.chatId, `👱‍♀️ ${botMessage.response}`)
                                .then((result) => result)
                                .catch((error) => error);

                        case WhatsappMessageType.reply:
                            return await whatsappRef.reply(message.chatId, `👱‍♀️ ${botMessage.response}`, message.id)
                                .then((result) => result)
                                .catch((error) => error);

                        case WhatsappMessageType.image:
                            return await whatsappRef.sendImage(message.chatId, 'src\\temp\\banner.jpg', 'Banner', 'Caption')
                                .then((result) => result)
                                .catch((error) => error);

                        case WhatsappMessageType.location:
                            return await whatsappRef.sendLocation(message.chatId, '-1.722247', '-48.879224', 'Location')
                                .then((result) => result)
                                .catch((error) => error);
                    }
                });

            } else {
                return await whatsappRef.sendText(message.chatId, `👱‍♀️ Se você estiver tentando por áudio, por favor tente enviar uma mensagem de texto para continuar.`)
                    .then((result) => result)
                    .catch((error) => error);
            }
        });
    }

    async setProfileStatus(dto: DtoWhatsappProfileStatus): Promise<void> {
        if (this.whatsappRef) {
            await this.whatsappRef.setProfileStatus(dto.profileStatus);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfileName(dto: DtoWhatsappProfileName): Promise<void> {
        if (this.whatsappRef) {
            await this.whatsappRef.setProfileName(dto.profileName);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfilePic(file: Express.Multer.File): Promise<void> {
        if (this.whatsappRef) {
            const filePath = `src/temp/${file.originalname}`;
            await this.whatsappRef.setProfilePic(filePath).then(() => {
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

    async sendWhatsappMessage(chatId: string, message: string) {
        if (this.whatsappRef) {
            return await this.whatsappRef.sendText(chatId, `👱‍♀️ ${message}`)
                .then((result) => result)
                .catch((error) => error);
        }
    }
}
