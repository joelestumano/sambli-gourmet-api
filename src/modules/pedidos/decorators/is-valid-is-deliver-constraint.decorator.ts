import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';
import { TaxasService } from 'src/modules/taxas-e-servicos/taxas.service';
import { BadRequestException } from '@nestjs/common';
import { TaxaRefEnum } from 'src/modules/taxas-e-servicos/entities/taxa.entity';
import { PedidoTaxaDto } from '../dtos/taxa-servico.dto';

@ValidatorConstraint({ name: 'IsValidIsDeliver', async: true })
export class IsValidIsDeliverConstraint
    implements ValidatorConstraintInterface {

    constructor(private taxasService: TaxasService) { }

    async validate(isDeliver: boolean, args: ValidationArguments) {
        const dto = args.object as PedidoCreateDto;
        if (isDeliver) {

            if (!('endereco' in dto)) {
                throw new BadRequestException(`pedido para entrega requer informações de endereço para entrega`);
            }

            if (!('taxas' in dto)) {
                throw new BadRequestException(`pedido para entrega requer informações da taxa de entrega`);
            }

            const pedidoTaxaEntrega = dto.taxas.find((t: PedidoTaxaDto) => t.referencia === TaxaRefEnum.ENTREGA);

            if (!pedidoTaxaEntrega) {
                throw new BadRequestException(`taxa de entrega não informada na lista de taxas`);
            }

            const valid = await this.taxasService.findById(pedidoTaxaEntrega._id);
            return valid ? true : false;

        } else {
            return true;
        }
    }
}

export function IsValidIsDeliver(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsValidIsDeliverConstraint,
        });
    };
}