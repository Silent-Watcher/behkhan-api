import type { INestApplication } from '@nestjs/common';
import { TypeormStore } from 'connect-typeorm';
import session from 'express-session';
import { DataSource } from 'typeorm';
import { isProduction } from '#constants/environment.js';
import { _1DAY_TO_MS, _1DAY_TO_SECONDS } from '#constants/time.js';
import { CookiePrefix } from '#enums/auth.js';
import { SessionEntitiy } from '#modules/session/session.entity.js';

export function setupSession(app: INestApplication, secret: string) {
	const sessionRepository = app.get(DataSource).getRepository(SessionEntitiy);

	app.use(
		session({
			secret,
			saveUninitialized: true,
			name: `${isProduction ? CookiePrefix.Host : ''}behkhan.session`,
			resave: false,
			cookie: {
				httpOnly: true,
				maxAge: _1DAY_TO_MS,
				secure: isProduction,
				sameSite: 'lax',
				priority: 'high',
				path: '/',
			},
			store: new TypeormStore({
				cleanupLimit: 2,
				ttl: _1DAY_TO_SECONDS,
			}).connect(sessionRepository),
		}),
	);
}
