import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { create, Message, Whatsapp } from 'venom-bot';

@Injectable()
export class WhatsappService {
    private openai: OpenAIApi;
    private customerChat: ChatCompletionRequestMessage[] = [
        {
            role: 'system',
            content:
                'Você é uma atendente de delivery de refeição da empresa Sambli Gourmet, você deve atender e receber pedidos dos clientes e atender da melhor forma possível',
        },
    ];

    private botMode = true;

    constructor(private configService: ConfigService) {
        const openaiConfig = new Configuration({
            apiKey: this.configService.get<string>('openai.key'),
        });
        this.openai = new OpenAIApi(openaiConfig);
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
            switch (message.body) {
                case 'bot-kill':
                    this.botMode = false;
                    break;
                case 'bot-restore':
                    this.botMode = true;
                    break;
            }

            if (
                message.body &&
                !message.isGroupMsg &&
                !['bot-kill', 'bot-restore'].includes(message.body)
            ) {
                if (this.botMode) {
                    this.customerChat.push({
                        role: 'user',
                        content: message.body,
                    });

                    console.log('message: ', message);

                    const response =
                        (await this.completion(this.customerChat)) || 'Não entendi...';

                    this.customerChat.push({
                        role: 'assistant',
                        content: response,
                    });

                    //return await this.sendText(client, message, response);
                    //return await this.reply(client, message, response);
                    return await this.sendImage(client, message, 'src\\modules\\whatsapp\\img.jpg','name','caption');
                    //return await this.sendLocation(client, message, { lat: '-1.722247', lng: '-48.879224' }, 'Title');
                }
            }
        });
    }

    private async completion(
        messages: ChatCompletionRequestMessage[],
    ): Promise<string | undefined> {
        const completion = await this.openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0.7,
            max_tokens: 256,
            messages: messages,
        });
        return completion.data.choices[0].message?.content;
    }

    /*  */
    private async sendText(client: Whatsapp, message: Message, res: any) {
        return await client
            .sendText(message.from, `👱‍♀️ ${res}`)
            .then((result) => {
                console.log('sendText success: ', result);
            })
            .catch((erro) => {
                console.error('sendText error when sending: ', erro);
            });
    }

    private async reply(client: Whatsapp, message: Message, res: any) {
        return await client
            .reply(message.from, `👱‍♀️ ${res}`, message.id)
            .then((result) => {
                console.log('reply success: ', result);
            })
            .catch((erro) => {
                console.error('reply error when sending: ', erro);
            });
    }

    private async sendLocation(client: Whatsapp, message: Message, location: { lat: string, lng: string }, title: string) {
        return await client
            .sendLocation(message.from, location.lat, location.lng, title)
            .then((result) => {
                console.log('sendLocation success: ', result);
            })
            .catch((erro) => {
                console.error('sendLocation when sending: ', erro);
            });
    }

    private async sendImage(client: Whatsapp, message: Message, path: string, name: string, caption: string) {
        return await client.sendImage(message.from, path, name, caption)
            .then((result) => {
                console.log('sendImage success: ', result);
            })
            .catch((erro) => {
                console.error('sendImage error when sending: ', erro);
            });
    }
}
