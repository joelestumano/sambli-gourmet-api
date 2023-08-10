import { Injectable } from '@nestjs/common';
import { BusinessEnum } from '../enums/business.enum';

@Injectable()
export class PromptService {
    private source = {
        business: BusinessEnum.food,
        company: 'XptgH Company',
    };

    private prompt: string = '';

    readPrompt(): string {
        this.prompt = `Você é uma atendente de delivery de ${this.source.business} da empresa ${this.source.company}, você deve atender os pedidos do cliente da melhor forma possível. 
         Muita atenção, não se esqueça de: 
         - atender o cliente pelo nome que é {{name}}
         - de informar o número do protocolo de atendimento ao cliente que é {{protocol}}`;
        return this.prompt;
    }

    updatePrompt(args: { business: BusinessEnum; company: string }): string {
        this.source.business = args.business;
        this.source.company = args.company;
        this.prompt = `Você é uma atendente de delivery de ${this.source.business} da empresa ${this.source.company}, você deve atender os pedidos do cliente da melhor forma possível. 
        Muita atenção, não se esqueça de: 
        - atender o cliente pelo nome que é {{name}}
        - de informar o número do protocolo de atendimento ao cliente que é {{protocol}}`;
        return this.prompt;
    }
}
