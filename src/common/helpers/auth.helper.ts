import { promisify } from 'node:util';
import type { Request } from 'express';

export async function regenerateSession(req: Request): Promise<void> {
	return promisify(req.session.regenerate).call(req.session);
}

export async function loginUser(
	req: Request,
	user: Express.User,
): Promise<void> {
	await promisify(req.login).call(req, user);
}

export async function logoutUser(req: Request): Promise<void> {
	await promisify(req.logout).call(req);
}
