import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import type { Operation } from 'fast-json-patch';
import fastJsonPatch from 'fast-json-patch';

@Injectable()
export class JsonPatchValidationPipe
	implements PipeTransform<Operation[], Operation[]>
{
	transform(value: Operation[], _metadata: ArgumentMetadata): Operation[] {
		const error = fastJsonPatch.validate(value);

		if (error) {
			throw new BadRequestException({
				message: 'Invalid JSON Patch document',
				error: error.message,
				operation: error.operation,
				index: error.index,
			});
		}

		return value;
	}
}
