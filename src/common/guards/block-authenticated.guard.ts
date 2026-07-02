import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import type { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { BLOCK_IF_AUTHENTICATED } from '../decorators/block-if-authenticated.decorator.js';

@Injectable()
export class BlockAuthenticated implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest<Request>();

		const enabled = this.reflector.getAllAndOverride(
			BLOCK_IF_AUTHENTICATED,
			[context.getClass(), context.getHandler()],
		);

		if (enabled) return true;

		if (req.isAuthenticated()) {
			throw new ForbiddenException(
				'forbidden action for authenticated user',
			);
		}

		return true;
	}
}
