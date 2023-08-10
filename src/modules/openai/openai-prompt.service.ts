import { Injectable } from '@nestjs/common';
import { BusinessEnum } from './enums/business.enum';
import { ProdutosService } from 'src/modules/produtos/produtos.service';

@Injectable()
export class OpenaiPromptService {

    private source = {
        business: BusinessEnum.food,
        company: 'XptgH Company',
        produtos: ''
    };

    private prompt: string = '';

    constructor(private readonly produtosService: ProdutosService) {

        this.produtosService.list().then(produtos => {
            produtos.forEach((produto, index) => {
                this.source.produtos += ` - ${index + 1}. ${produto.descricao}. R$ ${produto.valor} \n`
            });
        })

    }

    readPrompt(): string {
        this.prompt = `Você é uma atendente de delivery de ${this.source.business} da empresa ${this.source.company}, você deve atender os pedidos do cliente da melhor forma possível. 
         
        Muita atenção, não se esqueça de: 

         - atender o cliente pelo nome que é {{name}} 
         - de informar o número do protocolo de atendimento ao cliente que é {{protocol}} 

        O roteiro de atendimento é:

        - 1. Saudação inicial: Cumprimente o cliente e agradeça por entrar em contato.
        - 4. Cardápio:  Envie a lista resumida apenas com os nomes das opções do cardápio e pergunte ao cliente ele deseja pedir.

        Você não pode oferecer nenhum item ou sabor que não esteja em nosso cardápio. Siga estritamente as listas de opções aseguir:
         
        Cardápio de ${this.source.business} (o número da opção está no início de cada item):

        ${this.source.produtos}`;

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
