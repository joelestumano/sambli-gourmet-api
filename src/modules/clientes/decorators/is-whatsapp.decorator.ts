import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsWhatsappValidatorConstraint implements ValidatorConstraintInterface {
    validate(whatsapp: string, args: ValidationArguments) {
        if (!whatsapp?.replace('+55', '')) {
            return false;
        }
        return whatsapp.length >= 13 && whatsapp.length <= 14;
    }
}

export function IsWhatsappValidator(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isWhatsapp',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: IsWhatsappValidatorConstraint,
        });
    };
}