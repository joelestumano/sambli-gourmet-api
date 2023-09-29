import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';
import { TaxasEServicosService } from 'src/modules/taxas-e-servicos/taxas-e-servicos.service';

@ValidatorConstraint({ name: 'IsValidIsDeliver', async: true })
export class IsValidIsDeliverConstraint
    implements ValidatorConstraintInterface {

    constructor(private taxasEServicosService: TaxasEServicosService) { }

    validate(isDeliver: boolean, args: ValidationArguments) {
        const dto = args.object as PedidoCreateDto;
        if (isDeliver) {
            if ('endereco' in dto && 'taxasEServicos' in dto) {
                return true;
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