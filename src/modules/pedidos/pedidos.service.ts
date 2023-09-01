import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PedidoStatusPaginateQueryEnum, PedidosPaginateQueryDto } from './dtos/pedido-paginate-query.dto';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { PedidoCreateDto } from './dtos/pedido-create.dto';
import { Pedido, PedidoDocument } from './entities/pedido.entity';
import { Client } from '../clients/entities/client.entity';

@Injectable()
export class PedidosService {

    constructor(@InjectModel(Pedido.name) private readonly pedidoModel: Model<Pedido>) { }

    async create(dto: PedidoCreateDto): Promise<Pedido> {
        const order = await new this.pedidoModel(dto).save();
        return order;
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
                    select: { name: 1, _id: 0, whatsapp: 1, adresses: 1 },
                    model: Client.name
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

            if (dto.status !== PedidoStatusPaginateQueryEnum.todos) {
                Object.assign(query, {
                    status: dto.status
                })
            }
        }

        return await (this.pedidoModel as PaginateModel<PedidoDocument>).paginate(
            query,
            options,
        );
    }
}
