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

	findOneByIdentifier(
		identifier: string,
		projection?: Partial<Record<keyof UserEntity, boolean>>,
	): Promise<UserEntity | null> {
		return this.userRepository.findOne({
			where: [
				{ email: identifier },
				{ phone: identifier },
				{ username: identifier },
			],
			select: projection,
		});
	}

	findOneByIdentifierWithPassword(
		identifier: string,
		select?: (keyof UserEntity)[],
	): Promise<UserEntity | null> {
		const qb = this.userRepository.createQueryBuilder('user');

		if (select && select.length > 0) {
			qb.select(select.map((field) => `user.${field}`));
		}

		qb.addSelect('user.password').where(
			'user.email = :identifier OR user.phone = :identifier OR user.username = :identifier',
			{ identifier },
		);

		return qb.getOne();
	}

	save(user: UserEntity): Promise<UserEntity> {
		return this.userRepository.save(user);
	}
}
