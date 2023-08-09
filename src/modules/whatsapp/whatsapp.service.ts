import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { create, Message, SendFileResult, Whatsapp } from 'venom-bot';
import { OpenaiService } from '../openai/openai.service';
import { DtoWhatsappProfileName } from './dtos/whatsapp-profile-name.dto';
import { DtoWhatsappProfileStatus } from './dtos/whatsapp-profile-status.dto';

@Injectable()
export class WhatsappService {

    private client: Whatsapp = null;

    constructor(private readonly openaiService: OpenaiService) {
        create({
            session: 'session-sambli-gourmet-api',
            autoClose: 0
        }).then(async (client: Whatsapp) => await this.start(client))
            .catch((error) => {
                console.error('error: ', error);
            });
    }

    private async start(client: Whatsapp) {

        this.client = client;

        client.onMessage(async (message: Message) => {
            if (message.body && !message.isGroupMsg) {

                this.openaiService.getMessage(message).then(async response => {
                    console.log('message: ', message);
                    return await this.sendText(client, message.chatId, response);
                    //return await this.reply(client, message.chatId, response, message.id);
                    //return await this.sendImage(client, message.chatId, 'src\\modules\\whatsapp\\img.jpg', 'name', 'Image');
                    //return await this.sendLocation(client, message.chatId, { lat: '-1.722247', lng: '-48.879224' }, 'Location');
                });
            }
        });
    }

    private async sendText(client: Whatsapp, to: string, content: string): Promise<Object> {
        return await client
            .sendText(to, `👱‍♀️ ${content}`).then((result) => result)
            .catch((error) => error);
    }

    private async reply(client: Whatsapp, to: string, content: string, quotedMsg: string): Promise<Message | object> {
        return await client
            .reply(to, `👱‍♀️ ${content}`, quotedMsg).then((result) => result)
            .catch((error) => error);
    }

    private async sendLocation(client: Whatsapp, to: string, location: { lat: string, lng: string }, title: string): Promise<unknown> {
        return await client
            .sendLocation(to, location.lat, location.lng, title).then((result) => result)
            .catch((error) => error);
    }

    private async sendImage(client: Whatsapp, to: string, filePath: string, fileName?: string, caption?: string, passId?: any): Promise<SendFileResult> {
        return await client.sendImage(to, filePath, fileName, caption).then((result) => result)
            .catch((error) => error);
    }

    /* private async sendButtons(client: Whatsapp, to: string, title: string, buttons: any, description: string): Promise<Object> {
        return await client.sendButtons(to, title, buttons, description).then((result) => result)
            .catch((error) => error);
    } */

    async setProfileStatus(dto: DtoWhatsappProfileStatus) {
        if (this.client) {
            return await this.client.setProfileStatus(dto.profileStatus).then((result) => result)
                .catch((error) => error);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfileName(dto: DtoWhatsappProfileName) {
        if (this.client) {
            return await this.client.setProfileName(dto.profileName).then((result) => result)
                .catch((error) => error);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }

    async setProfilePic(file: Express.Multer.File): Promise<boolean> {
        if (this.client) {
            const picturePath = `src/temp/${file.originalname}`;
            return await this.client.setProfilePic(picturePath).then((result) => {
                const fs = require("fs")
                fs.unlinkSync(picturePath).catch((error: any) => { throw new InternalServerErrorException(error) })
                return result;
            }).catch((error) => error);
        } else {
            throw new InternalServerErrorException('Whatsapp client is null');
        }
    }
}
