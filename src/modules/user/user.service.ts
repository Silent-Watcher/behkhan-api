import { forwardRef, Inject, Injectable } from '@nestjs/common';
import type { UserEntity } from './user.entity.js';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
	constructor(
		@Inject(forwardRef(() => UserRepository))
		private readonly userRepository: UserRepository,
	) {}

	save(user: UserEntity) {
		return this.userRepository.save(user);
	}

	findOneByIdentifierWithPassword<T extends keyof UserEntity = never>(
		identifier: string,
		select?: (keyof UserEntity)[],
	): Promise<Pick<UserEntity, T | 'password'> | null> {
		return this.userRepository.findOneByIdentifierWithPassword(
			identifier,
			select,
		);
	}

	findOneByIdentifier(
		identifier: string,
		projection?: Partial<Record<keyof UserEntity, boolean>>,
	): Promise<UserEntity | null> {
		return this.userRepository.findOneByIdentifier(identifier, projection);
	}
}
