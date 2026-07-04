import {
	type CanActivate,
	type ExecutionContext,
	Injectable,
} from '@nestjs/common';
// biome-ignore lint/style/useImportType: <should emit some metadata for the reflector>
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { IS_PUBLIC_TOKEN } from '../decorators/public.decorator.js';

@Injectable()
export class ProtectedGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_TOKEN,
			[context.getClass(), context.getHandler()],
		);

		if (isPublic) return true;

		const request = context.switchToHttp().getRequest<Request>();
		console.log('request.isAuthenticated(): ', request.isAuthenticated());
		return request.isAuthenticated();
	}
}
