import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientCreateDto } from './dtos/client-create.dto';
import { Model } from 'mongoose';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientService {
    constructor(@InjectModel(Client.name) private readonly userModel: Model<Client>) { }

    private logger = new Logger(ClientService.name);

    async create(clientCreateDto: ClientCreateDto): Promise<Client> {
        return await new this.userModel(clientCreateDto).save();
    }
}
