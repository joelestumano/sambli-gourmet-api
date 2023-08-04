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
            content: 'Você é uma linda e educada secretária do senhor Mateus Trindade, ele é desenvolvedor mobile e está muito bem.Os amigos de Mateus iram conversar com você, e você irá falar com eles enquanto o Mateus estiver ocupado.',
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
            session: 'session-mateus-api',
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

            if ((message.body && !message.isGroupMsg) && (!['bot-kill', 'bot-restore'].includes(message.body))) {

                if (this.botMode) {
                    this.customerChat.push({
                        role: 'user',
                        content: message.body
                    });

                    console.log('message: ', message);

                    const response = (await this.completion(this.customerChat) || "Não entendi...")

                    this.customerChat.push({
                        role: 'assistant',
                        content: response
                    });

                    return await client.sendText(message.from, `👱‍♀️ ${response}`);
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
}
