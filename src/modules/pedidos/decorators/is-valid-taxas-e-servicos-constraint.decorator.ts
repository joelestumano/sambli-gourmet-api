import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';
import { TaxasEServicosService } from 'src/modules/taxas-e-servicos/taxas-e-servicos.service';

@ValidatorConstraint({ name: 'IsValidTaxasEServicos', async: true })
export class IsValidTaxasEServicosConstraint
    implements ValidatorConstraintInterface {

    constructor(private taxasEServicosService: TaxasEServicosService) { }

    validate(taxas: any, args: ValidationArguments) {

        const dto = args.object as PedidoCreateDto;

        if (dto.isDeliver) {
            return true
        } else {
            return true;
        }
    }
}

export function IsValidTaxasEServicos(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsValidTaxasEServicosConstraint,
        });
    };
}
