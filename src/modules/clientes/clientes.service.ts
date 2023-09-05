import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClienteCreateDto } from './dtos/cliente-create.dto';
import mongoose, { Model, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';
import { Client, ClientDocument } from './entities/cliente.entity';
import { PaginateConfig } from 'src/common/paginate/paginate-config';
import { ClientPaginateQueryDto } from './dtos/cliente-paginate-query.dto';

@Injectable()
export class ClientesService {
    constructor(@InjectModel(Client.name) private readonly clientModel: Model<Client>) { }

    private logger = new Logger(ClientesService.name);

    async create(clienteCreateDto: ClienteCreateDto): Promise<Client> {
        return await new this.clientModel(clienteCreateDto).save();
    }

    async paginate(dto: ClientPaginateQueryDto): Promise<PaginateResult<any>> {

        let options: PaginateOptions = {
            page: dto.pagina,
            limit: dto.limite,
            customLabels: PaginateConfig.paginateCustomLabels(),
            sort: { createdAt: 'desc' },
            pagination: dto.ativarPaginacao
        };

        let query = { isDeleted: false, active: true };
        if (dto.name) {
            Object.assign(query, { name: { $regex: new RegExp(dto.name, 'i') } });
        }

        return await (this.clientModel as PaginateModel<ClientDocument>).paginate(
            query,
            options,
        );
    }

    async findById(id: mongoose.Schema.Types.ObjectId): Promise<Client> {
        const found = await this.clientModel.findById(`${id}`).exec();
        if (!found) {
            const message = `nenhum cliente encontrado com a propriedade _id ${id}`;
            throw new NotFoundException(message);
        }
        return found;
    }
}
