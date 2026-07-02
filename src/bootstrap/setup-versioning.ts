import type { INestApplication } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';

export function setupVersioning(app: INestApplication) {
	app.enableVersioning({
		type: VersioningType.MEDIA_TYPE,
		defaultVersion: '1',
		key: 'v=',
	});
}
