import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import type { UserEntity } from '#modules/user/user.entity.js';
import { UserService } from '#modules/user/user.service.js';

@Injectable()
export class SessionSerializer extends PassportSerializer {
	constructor(
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {
		super();
	}

	serializeUser(
		user: UserEntity,
		done: (err: Error | null, id?: number | string) => void,
	) {
		return done(null, user.id);
	}

	async deserializeUser(
		id: string | number,
		done: (err: Error | null, user: UserEntity | null) => void,
	) {
		try {
			const user = await this.userService.findOneById(Number(id));
			done(null, user);
		} catch (err) {
			done(err as Error, null);
		}
	}
}
