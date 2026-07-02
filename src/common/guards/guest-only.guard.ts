import { GuestOnly } from '#decorators/guest-only.decorator.js';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <should emit some metadata for the reflector>
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

@Injectable()
export class GuestOnlyGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isGuestOnly = this.reflector.getAllAndOverride<boolean>(
			GuestOnly,
			[context.getHandler(), context.getClass()],
		);

		if (!isGuestOnly) {
			return true;
		}

		const req = context.switchToHttp().getRequest<Request>();

		if (req.isAuthenticated()) {
			throw new ForbiddenException(
				'forbidden action for authenticated user',
			);
		}

		return true;
	}
}
