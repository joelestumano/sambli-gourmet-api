import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { PedidoCreateDto } from '../dtos/pedido-create.dto';
import { PedidoTaxaDto } from '../dtos/taxa-servico.dto';
import { TaxaRefEnum } from 'src/modules/taxas-e-servicos/entities/taxa.entity';
import { BadRequestException } from '@nestjs/common';

@ValidatorConstraint({ name: 'IsPagamentoValid', async: false })
export class IsPagamentoValidConstraint implements ValidatorConstraintInterface {
    validate(pagamento: any, args: ValidationArguments) {
        const dto = args.object as PedidoCreateDto;

        if ('pagamento' in dto) {

            const sumaPagamento = Object.values(pagamento).reduce((suma: number, valor: number) => suma + valor, 0);
            const items = dto.items;
            const sumaItems = items.reduce((suma: number, item: any) => suma + item.valor, 0);

            if (dto.isDeliver) {

                if (!('taxas' in dto)) {
                    throw new BadRequestException(`pagamento no pedido para entrega requer informações da taxa de entrega`);
                }

                const pedidoTaxaEntrega = dto.taxas.find((t: PedidoTaxaDto) => t.referencia === TaxaRefEnum.ENTREGA);

                if (!pedidoTaxaEntrega) {
                    throw new BadRequestException(`taxa de entrega não informada na lista de taxas`);
                }

                return (sumaItems + pedidoTaxaEntrega.valor) === sumaPagamento;
            } else {
                return sumaItems === sumaPagamento;
            }
        }

        else {
            return true;
        }
    }
}

export function IsPagamentoValid(validationOptions?: ValidationOptions) {
    return (object: object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsPagamentoValidConstraint
        })
    }
}