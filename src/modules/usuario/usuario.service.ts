import { Injectable, Logger } from '@nestjs/common';
import { Usuario } from './entities/usuario.entity';
import { UsuarioCreateDto } from './dtos/usuario-create.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsuarioService {
    private readonly logger = new Logger(UsuarioService.name);

    constructor(@InjectModel(Usuario.name) private readonly usuarioModel: Model<Usuario>) { }

    async create(dto: UsuarioCreateDto): Promise<Usuario> {
        const create: Usuario = await new this.usuarioModel(dto).save();
        return create;
    }
}
