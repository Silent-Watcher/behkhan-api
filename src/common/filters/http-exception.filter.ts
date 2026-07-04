import { STATUS_CODES } from 'node:http';
import {
	ArgumentsHost,
	ExceptionFilter,
	HttpException,
} from '@nestjs/common';
import { Catch, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
	API_DEFAULT_VERSION,
	API_MEDIA_TYPE_VERSIONING_PAIR_SEPERATOR,
} from '#constants/app.js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status = exception.getStatus();
		const apiVersion = this.getApiVersionFromAcceptHeader(request);

		const message = status.toString().startsWith('4')
			? (exception.message ?? exception.name)
			: STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR];

		response.status(status).json({
			id: request.id,
			statusCode: status,
			message,
			method: request.method,
			path: request.path,
			apiVersion: `v${apiVersion}`,
			timestamp: new Date().toISOString(),
		});
	}

	private getApiVersionFromAcceptHeader(req: Request): number {
		const acceptHeader = req.headers.accept;
		const version = acceptHeader?.split(
			API_MEDIA_TYPE_VERSIONING_PAIR_SEPERATOR,
		)[1];
		if (!version) return Number(API_DEFAULT_VERSION);
		return Number(version);
	}
}
