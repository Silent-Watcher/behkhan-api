import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import type { AuthProvider } from '#enums/auth.js';
import { ExternalIdentityEntity } from '#modules/auth/external-identity.entity.js';
import type { UserEntity } from './user.entity.js';
import { UserRepository } from './user.repository.js';

@Injectable()
export class UserService {
	constructor(
		@Inject(forwardRef(() => UserRepository))
		private readonly userRepository: UserRepository,
		@InjectRepository(ExternalIdentityEntity)
		private readonly externalIdentityRepo: Repository<ExternalIdentityEntity>,
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

	findOneById(
		id: number | string,
		projection?: Partial<Record<keyof UserEntity, boolean>>,
	): Promise<UserEntity | null> {
		return this.userRepository.findOneById(id, projection);
	}

	findOneByExternalIdentity(
		providerUserId: string,
		provider: AuthProvider,
		projection?: Partial<Record<keyof UserEntity, boolean>>,
	): Promise<ExternalIdentityEntity | null> {
		return this.externalIdentityRepo.findOne({
			where: {
				providerUserId,
				provider,
			},
			relations: {
				user: true,
			},
			select: projection,
		});
	}
}
