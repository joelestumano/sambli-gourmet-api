import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';
import { TaxasService } from 'src/modules/taxas-e-servicos/taxas.service';
import { PedidoTaxaInterface } from '../entities/pedido.entity';

@ValidatorConstraint({ name: 'IsValidIsDeliver', async: true })
export class IsValidIsDeliverConstraint
    implements ValidatorConstraintInterface {

    constructor(private taxasService: TaxasService) { }

    async validate(isDeliver: boolean, args: ValidationArguments) {
        const dto = args.object as PedidoCreateDto;
        if (isDeliver) {
            if ('endereco' in dto && 'taxasEServicos' in dto && dto.taxas.length > 0) {
                const ids = dto.taxas.map((t: PedidoTaxaInterface) => {
                    return t._id;
                })
                const taxaEntrega = await this.taxasService.findByIdsEntrega(ids);
                return (taxaEntrega.length > 0);
            } else {
                return false;
            }
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