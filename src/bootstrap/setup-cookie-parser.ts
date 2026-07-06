import type { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';

export function setupCookieParser(app: INestApplication) {
	app.use(cookieParser());
}
