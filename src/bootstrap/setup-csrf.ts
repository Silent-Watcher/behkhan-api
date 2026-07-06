import type { INestApplication } from '@nestjs/common';
import { doubleCsrf } from 'csrf-csrf';
import type { Request } from 'express';
import { CSRF_TOKEN_HEADER } from '#constants/app.js';
import { isProduction } from '#constants/environment.js';

export function setupCsrf(app: INestApplication, secret: string) {
	const { doubleCsrfProtection } = doubleCsrf({
		getSecret: () => secret,
		cookieName: `${isProduction ? '__Host-' : ''}psifi.x-csrf-token`,
		cookieOptions: {
			sameSite: 'lax',
			path: '/',
			secure: isProduction,
		},
		size: 64,
		getCsrfTokenFromRequest: (req: Request) => {
			const token = req.headers[CSRF_TOKEN_HEADER.toLowerCase()];
			return Array.isArray(token) ? token[0] : (token as string);
		},
		getSessionIdentifier: (req: Request) =>
			req.session?.id ?? req?.sessionID,
	});
	app.use(doubleCsrfProtection);
}
