import type { INestApplication } from '@nestjs/common';
import passport from 'passport';

export function setupPassport(app: INestApplication) {
	app.use(passport.initialize());
	app.use(passport.session());
}
