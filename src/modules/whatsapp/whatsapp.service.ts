import { Injectable } from '@nestjs/common';
import { create, Message, Whatsapp } from 'venom-bot';

@Injectable()
export class WhatsappService {
    constructor() {
        this.bot();
    }

    async bot() {
        create({
            session: 'session-sambli-gourmet-api',
        })
            .then(async (client: Whatsapp) => await this.start(client))
            .catch((error) => {
                console.error('error: ', error);
            });
    }

    private async start(client: Whatsapp) {
        client.onMessage(async (message: Message) => {
            if (message.body && !message.isGroupMsg) {
                console.log('message: ', message);
                return await client.sendText(message.from, '🤖 Olá');
            }
        });
    }
}