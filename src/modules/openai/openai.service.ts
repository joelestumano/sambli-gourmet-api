import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { Message } from 'venom-bot';
import { DtoOpenaiChatSystem } from './dtos/openai-chat-system.dto';
import { prompt } from './sources/prompt';

type Call = {
    chatId: string,
    messages: ChatCompletionRequestMessage[];
}

@Injectable()
export class OpenaiService {

    private readonly logger = new Logger(OpenaiService.name);
    private readonly openai: OpenAIApi;

    private calls: Call[] = [];

    constructor(private readonly configService: ConfigService) {
        const openaiConfig = new Configuration({
            apiKey: this.configService.get<string>('openai.key'),
        });
        this.openai = new OpenAIApi(openaiConfig);
    }

    async loadChat(message: Message) {
        let chats = this.loadPrompt(message);
        chats.push({
            role: 'user',
            content: message.body,
        });
        const content = (await this.completion(chats)) || 'Não entendi...';
        chats.push({
            role: 'assistant',
            content: content,
        });
        return content;
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

    loadPrompt(message: Message): ChatCompletionRequestMessage[] {
        let call = this.calls.find((call) => call.chatId === message.chatId);
        if (call) {
            return call.messages;
        } else {
            let call: Call = {
                chatId: message.chatId,
                messages: this.initPrompt(this.fakeProtocol())
            }
            this.calls.push(call);
            return call.messages;
        }
    }

    private initPrompt(protocol: string): ChatCompletionRequestMessage[] {
        let customer: ChatCompletionRequestMessage[] = [];
        customer.unshift({
            role: 'system',
            content: prompt.replace(/{{[\s]?protocol[\s]?}}/g, protocol)
        });
        return customer;
    }

    fakeProtocol(): string {
        var data = new Date();
        return ("0" + data.getDate()).substr(-2) + ("0" + (data.getMonth() + 1)).substr(-2) + data.getFullYear() + Math.floor(1000 + Math.random() * 9000);
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

}
