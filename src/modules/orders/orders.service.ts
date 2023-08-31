import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PaginateQueryOrderDto } from './dtos/paginate-query-order.dto';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { PedidoCreateDto } from './dtos/order-create.dto';
import { Pedido, PedidoDocument } from './entities/order.entity';

@Injectable()
export class OrdersService {

    constructor(@InjectModel(Pedido.name) private readonly pedidoModel: Model<Pedido>) { }

    async create(dto: PedidoCreateDto): Promise<Pedido> {
        const order = await new this.pedidoModel(dto).save();
        return order;
    }

    async paginate(dto: PaginateQueryOrderDto): Promise<PaginateResult<any>> {
        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
        };

        let query = {};
        if (dto.dateStart && dto.dateEnd) {
            const start = new Date(dto.dateStart);
            const end = new Date(dto.dateEnd);
            query = {
                isDeleted: false, createdAt: {
                    $gte: start,
                    $lt: end
                },
                status: dto.status
            };
        }

        return await (this.pedidoModel as PaginateModel<PedidoDocument>).paginate(
            query,
            options,
        );
    }
}
