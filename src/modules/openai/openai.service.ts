import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from 'openai';
import { Message } from 'venom-bot';
import { OpenaiChatSystemDto } from './dtos/openai-chat-system.dto';
import { OpenaiPromptService } from './openai-prompt.service';
import { ECallState } from './enums/openai.enum';
import { OrdersService } from '../orders/orders.service';
import { Order, OrderStatus } from '../orders/entities/order.entity';

export enum WhatsappMessageType {
    text = 'text',
    reply = 'reply',
    location = 'location',
    image = 'image'
}

export interface OpenaiBotMessage {
    message: string;
    type: WhatsappMessageType
}

type Call = {
    chatId: string;
    messages: ChatCompletionRequestMessage[];
    orderId: string;
    status: ECallState;
};

@Injectable()
export class OpenaiService {
    private readonly logger = new Logger(OpenaiService.name);
    private readonly openai: OpenAIApi;
    private calls: Call[] = [];

    constructor(
        private readonly configService: ConfigService,
        private readonly promptService: OpenaiPromptService,
        private readonly ordersService: OrdersService
    ) {
        const openaiConfig = new Configuration({
            apiKey: this.configService.get<string>('openai.key'),
        });
        this.openai = new OpenAIApi(openaiConfig);
    }

    async botMessage(message: Message): Promise<OpenaiBotMessage> {
        return await this.loadCall(message).then(async (call: Call) => {

            call.messages.push({
                role: 'user',
                content: message.body,
            });

            const content = (await this.completion(call.messages)) || 'Não entendi...';

            call.messages.push({
                role: 'assistant',
                content: content,
            });

            if ((call.status === ECallState.open) && message.content.match(call.orderId)) {
                call.status = ECallState.close;

                this.calls = this.calls.filter(c => c.status === ECallState.open && c.chatId !== message.chatId);

                const order: Order = {
                    active: true,
                    client: message.sender.pushname,
                    descricao: content,
                    isDeleted: false,
                    order: call.orderId,
                    status: OrderStatus.pending,
                    whatsapp: call.chatId
                }

                await this.ordersService.create(order).then(result => {
                    console.log(result);
                });

            }

            return { message: content, type: WhatsappMessageType.text };

        });
    }

    private async completion(messages: ChatCompletionRequestMessage[]): Promise<string | undefined> {
        const completion = await this.openai.createChatCompletion({
            model: 'gpt-3.5-turbo',
            temperature: 0,
            max_tokens: 256,
            messages: messages,
        });
        return completion.data.choices[0].message?.content;
    }

    private async loadCall(message: Message): Promise<Call> {
        return new Promise<Call>((resolve, reject) => {
            let callRetrieved = this.calls.find((retrieved) => retrieved.chatId === message.chatId);
            if (callRetrieved) {
                resolve(callRetrieved);
            } else {
                let fakeProtocol = this.fakeProtocol();
                this.initPrompt(message.sender.pushname, fakeProtocol).then(init => {
                    let newCall: Call = {
                        chatId: message.chatId,
                        messages: init,
                        orderId: fakeProtocol,
                        status: ECallState.open,
                    };
                    this.calls.push(newCall);
                    resolve(newCall);
                })
            }
        });
    }

    private async initPrompt(name: string, orderId: string): Promise<ChatCompletionRequestMessage[]> {
        let customer: ChatCompletionRequestMessage[] = [];
        this.promptService.readPrompt().then((prompt: string) => {
            prompt.replace(/{{[\s]?name[\s]?}}/g, name).replace(/{{[\s]?orderId[\s]?}}/g, orderId);
            customer.unshift({
                role: 'system',
                content: prompt,
            });
        })
        return customer;
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
            this.promptService.updatePrompt({
                business: dto.business,
                company: dto.company,
            });
            resolve(this.promptService.readPrompt());
        });
    }
}
