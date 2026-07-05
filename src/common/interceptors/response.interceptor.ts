import type {
	CallHandler,
	ExecutionContext,
	NestInterceptor,
} from '@nestjs/common';
import {
	forwardRef,
	Inject,
	Injectable,
	RequestTimeoutException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { Observable } from 'rxjs';
import { catchError, map, TimeoutError, throwError, timeout } from 'rxjs';
import { API_REQUEST_TIMEOUT_MS } from '#constants/app.js';
import type { ApiResponse } from '#interfaces/api-response.interface.js';
import { ApiUtilService } from '#modules/util/api-util.service.js';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
	constructor(
		@Inject(forwardRef(() => ApiUtilService))
		private readonly apiUtilService: ApiUtilService,
	) {}

	intercept(
		context: ExecutionContext,
		next: CallHandler<any>,
	): Observable<any> | Promise<Observable<any>> {
		const request = context.switchToHttp().getRequest<Request>();
		const response = context.switchToHttp().getResponse<Response>();

		const startTime = Date.now();
		const apiVersion =
			this.apiUtilService.getApiVersionFromAcceptHeader(request);

		return next.handle().pipe(
			timeout(API_REQUEST_TIMEOUT_MS),
			map((data) => {
				if (data?.responseCode) {
					response.status(data?.responseCode);
				}

				if (data?.__location) {
					response.setHeader('Location', data.__location);
					data.__location = undefined;
				}

				if (data?.responseBody) data = { ...data.responseBody };

				const duration = Date.now() - startTime;

				if (data?.user?.password) data.user.password = undefined;

				const transformedResponse: Partial<ApiResponse> = {
					requestId: request.id,
					statusCode: data?.responseCode ?? response.statusCode,
					data: data?.message
						? this.extractDataFromResponse(data)
						: data,
					path: request.url,
					method: request.method,
					duration: `${duration}ms`,
					apiVersion: `v${apiVersion}`,
					timestamp: new Date().toISOString(),
				};

				if (data?.message) transformedResponse.message = data.message;

				return transformedResponse;
			}),
			catchError((error) => {
				const duration = Date.now() - startTime;

				if (error instanceof TimeoutError) {
					return throwError(
						() =>
							new RequestTimeoutException({
								message: 'Request timeout',
								duration: `${duration}ms`,
							}),
					);
				}

				error.requestId = request.id;
				error.duration = `${duration}ms`;

				return throwError(() => error);
			}),
		);
	}

	private extractDataFromResponse(
		responseData: Record<string | number | symbol, unknown>,
	) {
		const { message, ...data } = responseData;
		return data;
	}
}
