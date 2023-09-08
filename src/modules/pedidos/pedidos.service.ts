import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PedidosPaginateQueryDto } from './dtos/pedido-paginate-query.dto';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { PedidoCreateDto } from './dtos/pedido-create.dto';
import { Pedido, PedidoDocument, PedidoStatusEnum } from './entities/pedido.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomEvent } from '../../common/events/custom.event';
import { PedidoUpdateDto } from './dtos/pedido-update.dto';

@Injectable()
export class PedidosService {

    private readonly logger = new Logger(PedidosService.name);

    constructor(@InjectModel(Pedido.name) private readonly pedidoModel: Model<Pedido>,
        private eventEmitter: EventEmitter2) { }

    async create(dto: PedidoCreateDto): Promise<Pedido> {
        Object.assign(dto, { codigo: this.fakeProtocol() });
        const pedido: Pedido = await new this.pedidoModel(dto).save();
        this.eventEmitter.emit('changed-collection', new CustomEvent('changed-collection-pedidos', `pedido ${pedido['_id']} registrado!`));
        return pedido;
    }

    async paginate(dto: PedidosPaginateQueryDto): Promise<PaginateResult<any>> {
        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'asc' },
            pagination: dto.ativarPaginacao,
            populate: [
                {
                    path: 'cliente',
                    select: { nome: 1, _id: 0, whatsapp: 1 },
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
            dto.status === PedidoStatusEnum.concluido ||
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

    async update(id: string, dto: PedidoUpdateDto) {
        const found: Pedido = await this.findById(id);
        const update = await this.pedidoModel.updateOne({ _id: id }, dto, { upsert: true }).exec();
        this.eventEmitter.emit('changed-collection', new CustomEvent('changed-collection-pedidos', `pedido ${found['_id']} atualizado!`));
        return update;
    }

    async findById(id: string): Promise<Pedido> {
        const found = await this.pedidoModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhum pedido encontrado com a propriedade _id ${id}`;
            this.logger.error(message);
            throw new NotFoundException(message);
        }
        return found;
    }

    private fakeProtocol(): string {
        var data = new Date();
        return (
            ('0' + data.getDate()).substring(-2) +
            ('0' + (data.getMonth() + 1)).substring(-2) +
            data.getFullYear().toString().slice(2) +
            Math.floor(1000 + Math.random() * 9000)
        );
    }
}
