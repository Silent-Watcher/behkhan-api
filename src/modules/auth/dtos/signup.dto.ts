import type {
	ValidationArguments,
	ValidatorConstraintInterface,
} from 'class-validator';
import {
	IsString,
	IsStrongPassword,
	Matches,
	MaxLength,
	MinLength,
	Validate,
	ValidatorConstraint,
} from 'class-validator';

@ValidatorConstraint({ name: 'passwordMatch', async: false })
class PasswordMatchConstraint implements ValidatorConstraintInterface {
	validate(confirmPassword: string, args: ValidationArguments): boolean {
		const dto = args.object as SignupDto;
		return dto.password === confirmPassword;
	}

	defaultMessage(): string {
		return 'Passwords do not match';
	}
}

export class SignupDto {
	@IsString()
	@MinLength(3)
	@MaxLength(320)
	@Matches(
		/^([^\s@]+@[^\s@]+\.[^\s@]+|(?:\+98|0)?9\d{9}|[a-zA-Z][a-zA-Z0-9_]{2,31})$/,
		{
			message:
				'Identifier must be a valid email, Iranian mobile number, or username',
		},
	)
	declare identifier: string;

	@IsString()
	@IsStrongPassword({
		minSymbols: 0,
	})
	declare password: string;

	@IsString()
	@Validate(PasswordMatchConstraint)
	declare confirmPassword: string;
}
