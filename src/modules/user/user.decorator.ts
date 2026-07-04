import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { Request } from 'express';
import type { UserEntity } from './user.entity.js';

export const User = createParamDecorator<keyof UserEntity, Partial<UserEntity>>(
	(data: keyof UserEntity, ctx: ExecutionContext) => {
		const request = ctx.switchToHttp().getRequest<Request>();
		const user = request.user;

		return data ? user?.[data] : user;
	},
);
