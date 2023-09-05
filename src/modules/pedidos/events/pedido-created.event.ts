import { ItemPedidoInterface } from '../entities/pedido.entity';

export class PedidoCreatedEvent {
  readonly titulo: string;
  readonly descricao: ItemPedidoInterface[];

  constructor(titulo: string, descricao: ItemPedidoInterface[]) {
    this.titulo = titulo;
    this.descricao = descricao;
  }
}
