import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import {
	BadRequestException,
	forwardRef,
	Inject,
	NotFoundException,
} from '@nestjs/common';
import type { UserEntity } from '../user.entity.js';
import { UserService } from '../user.service.js';

export class UserByIdPipe
	implements PipeTransform<string, Promise<UserEntity>>
{
	constructor(
		@Inject(forwardRef(() => UserService))
		private userService: UserService,
	) {}

	async transform(
		value: string,
		_metadata: ArgumentMetadata,
	): Promise<UserEntity> {
		if (Number.isNaN(Number(value))) {
			throw new BadRequestException('Invalid user id format');
		}
		const user = await this.userService.findOneById(+value);
		if (!user) throw new NotFoundException('user not found');
		return user;
	}
}
