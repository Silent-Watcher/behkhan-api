import { STATUS_CODES } from 'node:http';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import {
	Catch,
	forwardRef,
	HttpException,
	HttpStatus,
	Inject,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiResponse } from '#interfaces/api-response.interface.js';
import { ApiUtilService } from '#modules/util/api-util.service.js';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	constructor(
		@Inject(forwardRef(() => ApiUtilService))
		private readonly apiUtilService: ApiUtilService,
	) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status = exception.getStatus();
		const apiVersion =
			this.apiUtilService.getApiVersionFromAcceptHeader(request);

		const message = status.toString().startsWith('4')
			? (exception.message ?? exception.name)
			: STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR];

		const responseBody: ApiResponse = {
			requestId: request.id,
			statusCode: status,
			message,
			method: request.method,
			path: request.path,
			apiVersion: `v${apiVersion}`,
			timestamp: new Date().toISOString(),
		};

		response.status(status).json(responseBody);
	}
}
