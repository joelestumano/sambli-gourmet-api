import { Injectable } from '@nestjs/common';
import { EBusiness } from './enums/openai.enum';
import { ProdutosService } from 'src/modules/produtos/produtos.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenaiPromptService {

    private company = {
        business: this.configService.get<string>('company.business') ? this.configService.get<string>('company.business') : EBusiness.food,
        name: this.configService.get<string>('company.name') ? this.configService.get<string>('company.name') : 'Default Company',
        produtos: ''
    };

    constructor(private readonly configService: ConfigService,
        private readonly produtosService: ProdutosService) { }

    async readPrompt(): Promise<string> {

        return await this.produtosService.list().then(produtos => {
            produtos.forEach((produto, index) => {
                this.company.produtos += `${index + 1} - ${produto.descricao} R$ ${(produto.valor).toFixed(2)} cada 100g\n`
            });

            return `Você é uma atendente virtual de delivery de ${this.company.business} da empresa ${this.company.name},
            você deve atender os clientes e seguir estritamente as instruções a seguir:

            - atender o cliente pelo nome que é {{name}} e agradecer por entrar em contato com a empresa.
            - informar o código do atendimento ao cliente que é {{orderId}}.
            - informar o cardápio que é: \n${this.company.produtos}
            - o cliente pode pedir uma ou mais opções do cardápio.
            - as opções são vendidas por valor em dinheiro informado pelo cliente, exemplo: 10 reais da opção 1.
            - todas as opções do cardápio são vendidas a partir de 100 gramas.
            - pergunte ao cliente quantos reais ele deseja gastar para a opção ou opções escolidas do cardápio.
            - forneça um exemplo de como o cliente pode fazer o pedido (ex: quero 5 reais da opção 1 e 8 reais da opção 2).
            - não existe cobrança de valores adicionais de nenhuma natureza.
            - a moeda é somente em Real brasileiro.
            - você não pode oferecer nenhum item que não esteja em nosso cardápio.
            
            Para confirmar o pedido, solicite ao cliente que digite corretamente o código do seu atendimento e endereço para entrega (nunca solicite o código do atendimento ao cliente sem que antes você tenha previamente informado ao cliente).
            Ao ser confirmado o código do atendimento, encerre o atendimento se despedindo cordialmente.
            - você não pode tratar de nenhum outro assunto além do definido aqui.`

        })
    }
}
