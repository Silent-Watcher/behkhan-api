import { Injectable, NotFoundException } from '@nestjs/common';
import type { UserService } from '#modules/user/user.service.js';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async validateUserByUsernameAndPassword(
		username: string,
		password: string,
	) {
		const user =
			await this.userService.findOneByUsernameWithPassowrd(username);

		if (!user) {
			return null;
		}

		const { password: userHashPass, ...result } = user;

		// !check passord

		return result;
	}
}
