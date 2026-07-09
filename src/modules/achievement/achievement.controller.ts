import {
	Body,
	Controller,
	forwardRef,
	Get,
	Inject,
	InternalServerErrorException,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import type { Operation } from 'fast-json-patch';
import { JsonPatchValidationPipe } from '#pipes/json-patch-validation.pipe.js';
import type { AchievementEntity } from './achievement.entity.js';
import { AchievementService } from './achievement.service.js';
// biome-ignore lint/style/useImportType: <we need to emit some metadata for this type>
import { CreateAchievementDto } from './dtos/create-achievement.dto.js';
import { AchievementByIdPipe } from './pipes/achievement-by-id.pipe.js';
import { ApiUtilService } from '#modules/util/api-util.service.js';

@Controller('achievements')
export class AchievementController {
	constructor(
		@Inject(forwardRef(() => AchievementService))
		private readonly achievementService: AchievementService,
		@Inject(forwardRef(() => ApiUtilService))
		private readonly apiUtilService: ApiUtilService,
	) {}

	@Post()
	async create(@Body() createDto: CreateAchievementDto) {
		const achievement = await this.achievementService.create(createDto);

		if (!achievement) {
			throw new InternalServerErrorException(
				'Service is Unavailable, try again',
			);
		}

		// TODO: get api base url from api utils
		return {
			data: achievement,
			message: 'Created!',
			__location: this.apiUtilService.getLocationHeader(
				'achievements',
				achievement.id,
			),
		};
	}

	@Get(':id')
	async findOne(
		@Param('id', AchievementByIdPipe) achievement: AchievementEntity,
	) {
		return achievement;
	}

	@Patch(':id')
	async patchOneById(
		@Param('id', AchievementByIdPipe) achievement: AchievementEntity,
		@Body(JsonPatchValidationPipe) patchData: Operation[],
	) {
		const result = await this.achievementService.patchOne(
			achievement,
			patchData,
		);
		return { achievement: result };
	}
}
