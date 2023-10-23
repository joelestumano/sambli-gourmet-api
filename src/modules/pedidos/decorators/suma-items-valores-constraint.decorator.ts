import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'IsPagamentoValid', async: false })
export class IsPagamentoValidConstraint implements ValidatorConstraintInterface {
    validate(pagamento: any, args: ValidationArguments) {

        const sumaPagamento = Object.values(pagamento).reduce((suma: number, valor: number) => suma + valor, 0);
        const dto = args.object as any;
        const items =  dto.items;
        const sumaItems = items.reduce((suma: number, item: any) => suma + item.valor, 0);

        return sumaItems === sumaPagamento; /* todo */ 
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