import type { INestApplication } from '@nestjs/common';
import session from 'express-session';

export function setupSession(app: INestApplication) {
	app.use(session());
}
