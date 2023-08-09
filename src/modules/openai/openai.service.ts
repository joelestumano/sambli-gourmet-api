import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { Message } from 'venom-bot';
import { DtoOpenaiChatSystem } from './dtos/openai-chat-system.dto';

@Injectable()
export class OpenaiService {

    private readonly logger = new Logger(OpenaiService.name);
    private readonly openai: OpenAIApi;

    private customerChat: ChatCompletionRequestMessage[] = [];

    constructor(private readonly configService: ConfigService) {
        const openaiConfig = new Configuration({
            apiKey: this.configService.get<string>('openai.key'),
        });
        this.openai = new OpenAIApi(openaiConfig);
    }

    async getMessage(message: Message) {
        if (!this.customerChat.length) {
            const prompt = 'Você é uma atendente de delivery de refeição da empresa Xptgh, você deve atender e receber pedidos dos clientes e atender da melhor forma possível. Informe o número do protocolo de atendimento ao cliente que é {{protocol}}.'
            const protoc = 'TE' + this.fakeProtocol();
            this.initPrompt(prompt, protoc);
        }
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

    async setChatSystem(dto: DtoOpenaiChatSystem) {
        /*  return new Promise<ChatCompletionRequestMessage>((resolve, reject) => {
             let system: ChatCompletionRequestMessage = {
                 role: 'system',
                 content: (dto.systemContent),
             }
             this.customerChat[0] = system;
             resolve(this.customerChat[0]);
         }); */
    }

    private initPrompt(prompt: string, protocol: string): void {
        this.customerChat.unshift({
            role: 'system',
            content: prompt.replace(/{{[\s]?protocol[\s]?}}/g, protocol)
        });
    }

    fakeProtocol(): string {
        var data = new Date();
        return ("0" + data.getDate()).substr(-2) + ("0" + (data.getMonth() + 1)).substr(-2) + data.getFullYear() + Math.floor(1000 + Math.random() * 9000);
    }
}
