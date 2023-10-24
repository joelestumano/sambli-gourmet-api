import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';
import { Logger } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsValidValorTotal', async: false })
export class IsValidValorTotalConstraint implements ValidatorConstraintInterface {

    private readonly logger = new Logger(IsValidValorTotalConstraint.name);

    validate(valorTotal: Number, args: ValidationArguments) {

        const dto = args.object as PedidoCreateDto;
        const pagamento = dto.pagamento;

        const taxasEServicos = ("taxasEServicos" in dto) ? dto.taxas.reduce((total, taxa) => {
            return total + taxa.valor; /** todo */
        }, 0) : 0;

        const sumaPagamento = Object.values(pagamento).reduce((suma: number, valor: number) => suma + valor, 0);
        return (sumaPagamento + taxasEServicos) === Number(valorTotal);
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
