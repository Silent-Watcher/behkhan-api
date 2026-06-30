import { Injectable } from '@nestjs/common';
import type { UserEntity } from './user.entity.js';
import type { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	findOneByUsername(username: string): Promise<UserEntity | null> {
		return this.userRepository.findOneByUsername(username);
	}

	findOneByUsernameWithPassowrd(
		username: string,
	): Promise<UserEntity | null> {
		return this.userRepository.findOneByUsernameWithPassowrd(username);
	}
}
