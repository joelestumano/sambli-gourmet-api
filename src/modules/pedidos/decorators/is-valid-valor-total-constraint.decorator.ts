import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';
import { BadRequestException, Logger } from '@nestjs/common';
import { PedidoTaxaDto } from '../dtos/taxa-servico.dto';
import { TaxaRefEnum } from 'src/modules/taxas-e-servicos/entities/taxa.entity';

@ValidatorConstraint({ name: 'IsValidValorTotal', async: false })
export class IsValidValorTotalConstraint implements ValidatorConstraintInterface {

    private readonly logger = new Logger(IsValidValorTotalConstraint.name);

    validate(valorTotal: Number, args: ValidationArguments) {
        const dto = args.object as PedidoCreateDto;

        const pagamento = dto.pagamento;

        if (dto.isDeliver) {

            if (!('taxas' in dto)) {
                throw new BadRequestException(`valor total no pedido para entrega requer informações da taxa de entrega`);
            }

            const pedidoTaxaEntrega = dto.taxas.find((t: PedidoTaxaDto) => t.referencia === TaxaRefEnum.ENTREGA);

            if (!pedidoTaxaEntrega) {
                throw new BadRequestException(`taxa de entrega não informada na lista de taxas`);
            }

            return true

        } else {

            const taxas = ("taxas" in dto) ? dto.taxas.reduce((total, taxa) => {
                return total + taxa.valor;
            }, 0) : 0;

            const sumaPagamento = Object.values(pagamento).reduce((suma: number, valor: number) => suma + valor, 0);
            return (sumaPagamento + taxas) === Number(valorTotal);
        }
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
