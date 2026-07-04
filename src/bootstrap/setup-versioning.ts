import type { INestApplication } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';
import {
	API_DEFAULT_VERSION,
	API_MEDIA_TYPE_VERSIONING_PAIR_SEPERATOR,
} from '#constants/app.js';

export function setupVersioning(app: INestApplication) {
	app.enableVersioning({
		type: VersioningType.MEDIA_TYPE,
		defaultVersion: API_DEFAULT_VERSION,
		key: `v${API_MEDIA_TYPE_VERSIONING_PAIR_SEPERATOR}`,
	});
}
