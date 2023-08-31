import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientCreateDto } from './dtos/client-create.dto';
import { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { Client, ClientDocument } from './entities/client.entity';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { ClientPaginateQueryDto } from './dtos/client-paginate-query.dto';

@Injectable()
export class ClientsService {
    constructor(@InjectModel(Client.name) private readonly clientModel: Model<Client>) { }

    private logger = new Logger(ClientsService.name);

    async create(clientCreateDto: ClientCreateDto): Promise<Client> {
        return await new this.clientModel(clientCreateDto).save();
    }

    async paginate(dto: ClientPaginateQueryDto): Promise<PaginateResult<any>> {

        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
            pagination: dto.ignorarPaginacao
        };

        let query = {};
        if (dto.name) {
            query = { isDeleted: false, name: { $regex: new RegExp(dto.name, 'i') } };
        }

        return await (this.clientModel as PaginateModel<ClientDocument>).paginate(
            query,
            options,
        );
    }
}
