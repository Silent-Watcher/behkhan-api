import {
	forwardRef,
	Inject,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service.js';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(forwardRef(() => AuthService))
		private readonly authService: AuthService,
	) {
		super({
			usernameField: 'identifier',
		});
	}

	async validate(identifier: string, password: string) {
		const user = await this.authService.validateUserByPassword(
			identifier,
			password,
		);

		if (!user) {
			throw new UnauthorizedException();
		}

		return user;
	}
}
