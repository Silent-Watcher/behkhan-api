import type { INestApplication } from '@nestjs/common';
import session from 'express-session';
import { isProduction } from '#constants/environment.js';
import { _1DAY_TO_MS } from '#constants/time.js';

export function setupSession(app: INestApplication, secret: string) {
	app.use(
		session({
			secret,
			saveUninitialized: false,
			resave: false,
			cookie: {
				httpOnly: true,
				maxAge: _1DAY_TO_MS,
				secure: isProduction,
				sameSite: 'lax',
				priority: 'high',
				path: '/',
			},
		}),
	);
}
