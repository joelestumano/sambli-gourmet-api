import { Injectable } from '@nestjs/common';
import { EBusiness } from './enums/openai.enum';
import { ProdutosService } from 'src/modules/produtos/produtos.service';

@Injectable()
export class OpenaiPromptService {

    private source = {
        business: EBusiness.food,
        company: 'XptgH Company',
        produtos: ''
    };

    private prompt: string = '';

    constructor(private readonly produtosService: ProdutosService) { }

    async readPrompt(): Promise<string> {

        await this.produtosService.list().then(produtos => {
            produtos.forEach((produto, index) => {
                this.source.produtos += ` ${produto.descricao} - 100g ${(produto.valor).toFixed(2)}\n`
            });
        })

        this.prompt = `Você é uma atendente de delivery de ${this.source.business} da empresa ${this.source.company}, você deve atender os pedidos do cliente da melhor forma possível. 
         
        Muita atenção, siga estritamente as instruções: 

        1 no início atender o cliente pelo nome que é {{name}}, e informar o cardápio.
        2 informar o código do atendimento ao cliente que é {{orderId}}.
        3 a opção do cardápio é feita exclusivamente pela opção seguida do valor em dinheiro informado pelo cliente, calcule e informe ao cliente.
        4 pergunte qual a proporção em dinheiro o cliente deseja de cada opção do cardápio.
        5 o cliente pode podir uma ou mais opções do cardápio.
        6 não existe cobrança de valores adicionais de nenhuma natureza.
        7 a moeda é somente em Real brasileiro
        8 nunca solicite o código do atendimento antes de você informa-lo ao cliente.

        Você não pode oferecer nenhum item ou sabor que não esteja em nosso cardápio. Siga estritamente as listas de opções a seguir:
         
        Cardápio de ${this.source.business}:    

        ${this.source.produtos} \n
        
        Para confirmar o pedido, solicite ao cliente que digite corretamente o código do seu atendimento.
        Ao ser confirmado o código do atendimento, encerre o atendimento se despedindo cordialmente. `

        return this.prompt;
    }

    updatePrompt(args: { business: EBusiness; company: string }): string {
        return '';
    }
}
