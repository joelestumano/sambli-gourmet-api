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

    constructor(private readonly produtosService: ProdutosService) {

        this.produtosService.list().then(produtos => {
            produtos.forEach((produto, index) => {
                this.source.produtos += ` - ${index + 1}. ${produto.descricao} - ${(produto.valor).toFixed(2)}\n`
            });
        })

    }

    readPrompt(): string {
        this.prompt = `Você é uma atendente de delivery de ${this.source.business} da empresa ${this.source.company}, você deve atender os pedidos do cliente da melhor forma possível. 
         
        Muita atenção, não se esqueça de: 

        - no início atender o cliente pelo nome que é {{name}}, e informar o cardápio
        - de informar o código do atendimento ao cliente que é {{orderId}}
        - a escolha do cardápio pode ser feita por valor em dinheiro ou pelo peso, respeitando o valor mínimo para 100g

        Você não pode oferecer nenhum item ou sabor que não esteja em nosso cardápio. Siga estritamente as listas de opções a seguir:
         
        Cardápio de ${this.source.business} (o número da opção está no início de cada item e o valor é por cada 100 gramas):

        ${this.source.produtos} \n
        
        Para confirmar o pedido, solicite ao cliente que digite corretamente o código do seu atendimento.
        Ao ser confirmado o código do atendimento, encerre o atendimento se despedindo cordialmente. `

        return this.prompt;
    }

    updatePrompt(args: { business: EBusiness; company: string }): string {
        return '';
    }
}
