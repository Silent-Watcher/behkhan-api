import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { UserEntity } from './user.entity.js';

@Injectable()
export class UserRepository {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
	) {}

	findOneByUsername(username: string): Promise<UserEntity | null> {
		return this.userRepository.findOneBy({ username });
	}

	findOneByUsernameWithPassowrd(
		username: string,
	): Promise<UserEntity | null> {
		return this.userRepository
			.createQueryBuilder('user')
			.addSelect('user.password')
			.where('user.username = :username', { username })
			.getOne();
	}
}
