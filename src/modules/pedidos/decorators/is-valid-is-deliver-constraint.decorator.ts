import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';
import { TaxasEServicosService } from 'src/modules/taxas-e-servicos/taxas-e-servicos.service';
import { TaxaServicoInterface } from '../entities/pedido.entity';

@ValidatorConstraint({ name: 'IsValidIsDeliver', async: true })
export class IsValidIsDeliverConstraint
    implements ValidatorConstraintInterface {

    constructor(private taxasEServicosService: TaxasEServicosService) { }

    async validate(isDeliver: boolean, args: ValidationArguments) {
        const dto = args.object as PedidoCreateDto;
        if (isDeliver) {
            if ('endereco' in dto && 'taxasEServicos' in dto && dto.taxasEServicos.length > 0) {
                const ids = dto.taxasEServicos.map((t: TaxaServicoInterface) => {
                    return t.taxaServico;
                })
                const taxaEntrega = await this.taxasEServicosService.findByIdsEntrega(ids);
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