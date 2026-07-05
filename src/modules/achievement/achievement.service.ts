import {
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import { AchievementEntity } from './achievement.entity.js';
import { AchievementRepository } from './achievement.repository.js';
import type { CreateAchievementDto } from './dtos/create-achievement.dto.js';

@Injectable()
export class AchievementService {
	constructor(
		@Inject(forwardRef(() => AchievementRepository))
		private readonly achievementRepo: AchievementRepository,
	) {}

	async create(
		createDto: CreateAchievementDto,
	): Promise<AchievementEntity | null> {
		const { name, minReadBookCount } = createDto;

		const achievementExists = await this.findOneByNameOrReadBookCount(
			name,
			{
				id: true,
				name: true,
			},
			minReadBookCount,
		);

		if (achievementExists) {
			throw new ConflictException('already exists.');
		}

		const newAchievement = new AchievementEntity();
		newAchievement.name = name;
		newAchievement.minReadBookCount = minReadBookCount;

		return this.achievementRepo.save(newAchievement);
	}

	findOneByNameOrReadBookCount(
		name: string,
		projection?: Partial<Record<keyof AchievementEntity, boolean>>,
		readBookCount?: number,
	): Promise<AchievementEntity | null> {
		return this.achievementRepo.findOneByNameOrReadBookCount(
			name,
			projection,
			readBookCount,
		);
	}
}
