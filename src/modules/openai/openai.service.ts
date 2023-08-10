import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { Message } from 'venom-bot';
import { OpenaiChatSystemDto } from './dtos/openai-chat-system.dto';
import { PromptService } from './prompt/prompt.service';

type Call = {
    chatId: string;
    messages: ChatCompletionRequestMessage[];
    status: 'open' | 'close';
};

@Injectable()
export class OpenaiService {
    private readonly logger = new Logger(OpenaiService.name);
    private readonly openai: OpenAIApi;
    private calls: Call[] = [];

    constructor(private readonly configService: ConfigService,
        private readonly promptService: PromptService) {
        const openaiConfig = new Configuration({
            apiKey: this.configService.get<string>('openai.key'),
        });
        this.openai = new OpenAIApi(openaiConfig);
    }

    async loadChat(message: Message): Promise<string> {
        return await this.loadPrompt(message).then(async (chats) => {
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
        });
    }

    private async completion(
        messages: ChatCompletionRequestMessage[],
    ): Promise<string | undefined> {
        const completion = await this.openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0.2,
            max_tokens: 256,
            messages: messages,
        });
        return completion.data.choices[0].message?.content;
    }

    private async loadPrompt(
        message: Message,
    ): Promise<ChatCompletionRequestMessage[]> {
        return new Promise<ChatCompletionRequestMessage[]>((resolve, reject) => {
            let call = this.calls.find((call) => call.chatId === message.chatId);
            if (call) {
                resolve(call.messages);
            } else {
                let call: Call = {
                    chatId: message.chatId,
                    messages: this.initPrompt(
                        message.sender.pushname,
                        this.fakeProtocol(),
                    ),
                    status: 'open'
                };
                this.calls.push(call);
                resolve(call.messages);
            } console.log(message)
        });
    }

    private initPrompt(
        name: string,
        protocol: string,
    ): ChatCompletionRequestMessage[] {
        let customer: ChatCompletionRequestMessage[] = [];
        customer.unshift({
            role: 'system',
            content: this.applyPatternReplace(name, protocol),
        });
        return customer;
    }

    private applyPatternReplace(name: string, protocol: string): string {
        return this.promptService.readPrompt()
            .replace(/{{[\s]?name[\s]?}}/g, name)
            .replace(/{{[\s]?protocol[\s]?}}/g, protocol);
    }

    private fakeProtocol(): string {
        var data = new Date();
        return (
            ('0' + data.getDate()).substring(-2) +
            ('0' + (data.getMonth() + 1)).substring(-2) +
            data.getFullYear() +
            Math.floor(1000 + Math.random() * 9000)
        );
    }

    async setChatSystem(dto: OpenaiChatSystemDto) {
        return new Promise<string>((resolve, reject) => {
            this.promptService.updatePrompt({ business: dto.business, company: dto.company })
            resolve(this.promptService.readPrompt());
        });
    }
}
