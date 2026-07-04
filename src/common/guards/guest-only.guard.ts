import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <should emit some metadata for the reflector>
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_GUEST_ONLY } from '#decorators/guest-only.decorator.js';

@Injectable()
export class GuestOnlyGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isGuestOnly = this.reflector.getAllAndOverride<boolean>(
			IS_GUEST_ONLY,
			[context.getHandler(), context.getClass()],
		);

		console.log('inside guest only');
		console.log('isGuestOnly: ', isGuestOnly);

		if (!isGuestOnly) {
			return true;
		}

		const req = context.switchToHttp().getRequest<Request>();
		console.log('req.isAuthenticated(): ', req.isAuthenticated());

		if (req.isAuthenticated()) {
			throw new ForbiddenException(
				'forbidden action for authenticated user',
			);
		}

		return true;
	}
}
