import {
	Body,
	Controller,
	forwardRef,
	Inject,
	InternalServerErrorException,
	Post,
} from '@nestjs/common';
import { AchievementService } from './achievement.service.js';
// biome-ignore lint/style/useImportType: <we need to emit some metadata for this type>
import { CreateAchievementDto } from './dtos/create-achievement.dto.js';

@Controller('achievements')
export class AchievementController {
	constructor(
		@Inject(forwardRef(() => AchievementService))
		private readonly achievementService: AchievementService,
	) {}

	@Post()
	async create(@Body() createDto: CreateAchievementDto) {
		const achievement = await this.achievementService.create(createDto);

		if (!achievement) {
			throw new InternalServerErrorException(
				'Service Unavailable, try again',
			);
		}

		// TODO: get api base url from api utils
		return {
			data: achievement,
			message: 'Created!',
			__location: `http:localhost:8080/api/achievements/${achievement.id}`,
		};
	}
}
