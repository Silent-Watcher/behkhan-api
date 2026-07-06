import {
	BadRequestException,
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Operation } from 'fast-json-patch';
import fastJsonPatch from 'fast-json-patch';
import { AchievementEntity } from './achievement.entity.js';
import { AchievementRepository } from './achievement.repository.js';
import type { CreateAchievementDto } from './dtos/create-achievement.dto.js';
import { PatchAchievementDto } from './dtos/patch-achievement.dto.js';

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

	findOneById(
		id: number,
		projection?: Partial<Record<keyof AchievementEntity, boolean>>,
	): Promise<AchievementEntity | null> {
		return this.achievementRepo.findOneById(id, projection);
	}

	async patchOne(achievement: AchievementEntity, patchData: Operation[]) {
		const clonedAchievement = structuredClone(achievement);
		const { newDocument } = fastJsonPatch.applyPatch(
			clonedAchievement,
			patchData,
		);
		const dto = plainToInstance(PatchAchievementDto, newDocument, {
			excludeExtraneousValues: true,
		});
		const errors = await validate(dto, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length > 0) {
			throw new BadRequestException(errors.toString());
		}

		return this.achievementRepo.patchOneById(achievement.id, newDocument);
	}
}
