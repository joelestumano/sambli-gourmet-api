import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PedidosPaginateQueryDto } from './dtos/pedido-paginate-query.dto';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { PedidoCreateDto } from './dtos/pedido-create.dto';
import { Pedido, PedidoDocument, PedidoStatusEnum } from './entities/pedido.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomEvent } from '../../common/events/pedido-created.event';

@Injectable()
export class PedidosService {

    private readonly logger = new Logger(PedidosService.name);

    constructor(@InjectModel(Pedido.name) private readonly pedidoModel: Model<Pedido>,
        private eventEmitter: EventEmitter2) { }

    async create(dto: PedidoCreateDto): Promise<Pedido> {
        const pedido: Pedido = await new this.pedidoModel(dto).save();

        this.eventEmitter.emit('pedido.created', new CustomEvent('novo pedido!', pedido.items));

        return pedido;
    }

    async paginate(dto: PedidosPaginateQueryDto): Promise<PaginateResult<any>> {
        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
            pagination: dto.ativarPaginacao,
            populate: [
                {
                    path: 'cliente',
                    select: { nome: 1, _id: 0, whatsapp: 1, enderecos: 1 },
                    model: Cliente.name
                },
            ]
        };

        let query = { isDeleted: false, active: true };
        if (dto.dateStart && dto.dateEnd) {
            const start = new Date(dto.dateStart);
            const end = new Date(dto.dateEnd);

            Object.assign(query, {
                createdAt: {
                    $gte: start,
                    $lt: end
                }
            })
        }

        if (dto.status === PedidoStatusEnum.pendente ||
            dto.status === PedidoStatusEnum.empreparo ||
            dto.status === PedidoStatusEnum.despachado ||
            dto.status === PedidoStatusEnum.cancelado) {
            Object.assign(query, {
                status: dto.status
            })
        }

        return await (this.pedidoModel as PaginateModel<PedidoDocument>).paginate(
            query,
            options,
        );
    }
}
