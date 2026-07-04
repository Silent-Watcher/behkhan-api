import type { HttpStatus } from '@nestjs/common';
import type { ReqId } from 'pino-http';

export interface ApiResponse {
	data?: unknown;
	message?: string;
	meta?: unknown;
	apiVersion: string;
	timestamp: string;
	path: string;
	requestId: ReqId;
	method: string;
	statusCode: HttpStatus;
	duration?: string;
}
