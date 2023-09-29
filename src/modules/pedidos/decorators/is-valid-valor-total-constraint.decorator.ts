import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';

@ValidatorConstraint({ name: 'IsValidValorTotal', async: false })
export class IsValidValorTotalConstraint implements ValidatorConstraintInterface {
    validate(valorTotal: any, args: ValidationArguments) {

        const dto = args.object as PedidoCreateDto;
        const pagamento = dto.pagamento;

        const taxasEServicos = ("taxasEServicos" in dto) ? dto.taxasEServicos.reduce((total, taxa) => {
            return total + taxa.valor;
        }, 0) : 0;

        const sumaPagamento = Object.values(pagamento).reduce((suma: number, valor: number) => suma + valor, 0);
        return (sumaPagamento + taxasEServicos) === valorTotal;
    }
}

export function IsValidValorTotal(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsValidValorTotalConstraint
        })
    }
}
