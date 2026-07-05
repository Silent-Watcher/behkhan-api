import type { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import {
	BadRequestException,
	forwardRef,
	Inject,
	NotFoundException,
} from '@nestjs/common';
import type { AchievementEntity } from '../achievement.entity.js';
import { AchievementService } from '../achievement.service.js';

export class AchievementByIdPipe
	implements PipeTransform<string, Promise<AchievementEntity>>
{
	constructor(
		@Inject(forwardRef(() => AchievementService))
		private achievementService: AchievementService,
	) {}

	async transform(
		value: string,
		_metadata: ArgumentMetadata,
	): Promise<AchievementEntity> {
		if (Number.isNaN(Number(value))) {
			throw new BadRequestException('Invalid achievement id format');
		}
		const achievement = await this.achievementService.findOneById(+value);
		if (!achievement) throw new NotFoundException('achievement not found');
		return achievement;
	}
}
