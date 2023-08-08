import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { Message } from 'venom-bot';

@Injectable()
export class OpenaiService {

    private readonly logger = new Logger(OpenaiService.name);
    private readonly openai: OpenAIApi;

    private customerChat: ChatCompletionRequestMessage[] = [
        {
            role: 'system',
            content:
                'Você é uma atendente de delivery de refeição da empresa Sambli Gourmet, você deve atender e receber pedidos dos clientes e atender da melhor forma possível',
        },
    ];

    constructor(private readonly configService: ConfigService) {
        const openaiConfig = new Configuration({
            apiKey: this.configService.get<string>('openai.key'),
        });
        this.openai = new OpenAIApi(openaiConfig);
    }

    async getMessage(message: Message) {
        this.customerChat.push({
            role: 'user',
            content: message.body,
        });
        const response = (await this.completion(this.customerChat)) || 'Não entendi...';
        this.customerChat.push({
            role: 'assistant',
            content: response,
        });
        return response;
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
