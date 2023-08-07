import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { create, Message, SendFileResult, Whatsapp } from 'venom-bot';

@Injectable()
export class WhatsappService {

    private readonly logger = new Logger(WhatsappService.name);

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
            autoClose: 0
        }).then(async (client: Whatsapp) => await this.start(client))
            .catch((error) => {
                console.error('error: ', error);
            });
    }

    private async start(client: Whatsapp) {

        /* 
        await client.setProfileStatus('Atendendo pedidos! 👱‍♀️');
        await client.setProfileName('Sambli Gourmet');
        await client.setProfilePic('src\\modules\\whatsapp\\img.jpg');
        */

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

                    //return await this.sendText(client, message.chatId, response);
                    //return await this.reply(client, message.chatId, response, message.id);
                    //return await this.sendImage(client, message.chatId, 'src\\modules\\whatsapp\\img.jpg', 'name', 'Image');
                    //return await this.sendLocation(client, message.chatId, { lat: '-1.722247', lng: '-48.879224' }, 'Location');
                    const buttons = [
                        {
                            "buttonId": "1",
                            "buttonText": {
                                "displayText": "Text of Button 1"
                            }
                        },
                        {
                            "buttonId": "2",
                            "buttonText": {
                                "displayText": "Text of Button 2"
                            }
                        }
                    ]
                    return await this.sendButtons(client, message.chatId, 'Title', buttons, 'Description')
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

    private async sendButtons(client: Whatsapp, to: string, title: string, buttons: any, description: string): Promise<Object> {
        return await client.sendButtons(to, title, buttons, description).then((result) => result)
            .catch((error) => error);
    }
}
