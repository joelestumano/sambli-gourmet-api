import { ItemPedidoInterface } from "../entities/pedido.entity";

export class PedidoCreatedEvent {
    nome: string;
    descricao: ItemPedidoInterface[];
}