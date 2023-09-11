import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

@ValidatorConstraint({ name: 'IsWhatsappValidator', async: false })
@Injectable()
export class IsWhatsappValidatorConstraint implements ValidatorConstraintInterface {

    validate(whatsapp: string, args: ValidationArguments) {
        if (whatsapp) {
            const constraints = args.constraints[0];
            const value = whatsapp.replace(constraints.prefix, '');
            const min = constraints.min;
            const max = constraints.max;
            return (value.length >= min && value.length <= max)
        }
    }
}

export function IsWhatsappValidator(args: { min: number, max: number, prefix: string }, validationOptions?: ValidationOptions) {
    return function (object: any, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [args],
            validator: IsWhatsappValidatorConstraint,
        });
    };
}