import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class IsSexConstraint implements ValidatorConstraintInterface {
  validate(sex: string, args: ValidationArguments): boolean {
    if (sex === 'K' || sex === 'M') return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Sex must be either K or M';
  }
}

/** Validate if the value specified is either K or M */
export function IsSex(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsSexConstraint,
    });
  };
}
