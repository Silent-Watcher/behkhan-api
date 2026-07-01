import {
	BadRequestException,
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import argon2 from 'argon2';
import { IdentifierType } from '#enums/auth.js';
import { UserEntity } from '#modules/user/user.entity.js';
import { UserService } from '#modules/user/user.service.js';
import {
	EMAIL_REGEX,
	IRANIAN_PHONE_REGEX,
	USERNAME_REGEX,
} from '../../common/regex/index.js';
import type { SignupDto } from './dtos/signup.dto.js';

@Injectable()
export class AuthService {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {}

	async signup(dto: SignupDto) {
		const { password, identifier } = dto;

		const userExists = await this.userService.findOneByIdentifier(
			identifier,
			{ id: true },
		);

		if (userExists) {
			throw new ConflictException(
				'A user with this identifier already exists.',
			);
		}

		const passwordHash = await argon2.hash(password);

		let newUser = new UserEntity();
		newUser.password = passwordHash;
		newUser = this.applyIdentifier(newUser, identifier);

		const user = await this.userService.save(newUser);
		return user;
	}

	async validateUserByPassword(identifier: string, password: string) {
		const identifierType = this.getIdentifierType(identifier);

		if (!identifier || !identifierType) {
			return null;
		}

		const user =
			await this.userService.findOneByIdentifierWithPassword(identifier);

		if (!user?.password) return null;

		const passwordVerified = await argon2.verify(user.password, password);

		if (!passwordVerified) return null;

		return user;
	}

	private getIdentifierType(identifier: string): IdentifierType | undefined {
		const value = identifier.trim();

		if (EMAIL_REGEX.test(value)) {
			return IdentifierType.EMAIL;
		}

		if (IRANIAN_PHONE_REGEX.test(value)) {
			return IdentifierType.PHONE;
		}

		if (USERNAME_REGEX.test(value)) {
			return IdentifierType.USERNAME;
		}

		return undefined;
	}

	private applyIdentifier(newUser: UserEntity, identifier: string) {
		const identifierType = this.getIdentifierType(identifier);

		if (identifierType === IdentifierType.EMAIL) {
			newUser.displayName = identifier.slice(0, identifier.indexOf('@'));
			newUser.email = identifier;
		} else if (identifierType === IdentifierType.PHONE) {
			newUser.phone = identifier;
		} else if (identifierType === IdentifierType.USERNAME) {
			newUser.username = identifier;
		} else {
			throw new BadRequestException('Invalid identifier type');
		}

		return newUser;
	}
}
