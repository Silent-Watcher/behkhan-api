import { promisify } from 'node:util';
import type { Request } from 'express';

export function regenerateSession(req: Request): Promise<void> {
	return promisify(req.session.regenerate).call(req.session);
}

export async function loginUser(
	req: Request,
	user: Express.User,
): Promise<void> {
	return promisify(req.login).call(req, user);
}

export function logoutUser(req: Request): Promise<void> {
	return promisify(req.logout).call(req);
}
