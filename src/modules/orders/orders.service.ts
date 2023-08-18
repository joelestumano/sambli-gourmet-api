import { Injectable } from '@nestjs/common';
import { Order, OrderDocument } from './entities/order.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { PaginateQueryOrderDto } from './dtos/paginate-query-order.dto';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { OrderCreateDto } from './dtos/order-create.dto';

@Injectable()
export class OrdersService {

    constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) { }

    async create(dto: OrderCreateDto): Promise<Order> {
        const order = await new this.orderModel(dto).save();
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

        return await (this.orderModel as PaginateModel<OrderDocument>).paginate(
            query,
            options,
        );
    }
}
