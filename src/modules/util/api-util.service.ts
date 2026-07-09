import { Injectable } from '@nestjs/common';
import type { Request } from 'express';
import {
	API_DEFAULT_VERSION,
	API_MEDIA_TYPE_VERSIONING_PAIR_SEPERATOR,
} from '#constants/app.js';

@Injectable()
export class ApiUtilService {
	getApiVersionFromAcceptHeader(req: Request): number {
		const acceptHeader = req.headers.accept;
		const version = acceptHeader?.split(
			API_MEDIA_TYPE_VERSIONING_PAIR_SEPERATOR,
		)[1];
		if (!version || Number.isNaN(version))
			return Number(API_DEFAULT_VERSION);
		return Number(version);
	}
}
