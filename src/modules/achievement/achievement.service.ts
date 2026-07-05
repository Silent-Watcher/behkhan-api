import {
	BadRequestException,
	ConflictException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import fastJsonPatch from 'fast-json-patch';
import type { Operation } from 'fast-json-patch';
import { AchievementEntity } from './achievement.entity.js';
import { AchievementRepository } from './achievement.repository.js';
import type { CreateAchievementDto } from './dtos/create-achievement.dto.js';
import { plainToInstance } from 'class-transformer';
import { PatchAchievementDto } from './dtos/patch-achievement.dto.js';
import { validate } from 'class-validator';

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
		// get a deep copy of the entity
		const clonedAchievement = structuredClone(achievement);
		// apply patch
		const { newDocument } = fastJsonPatch.applyPatch(
			clonedAchievement,
			patchData,
		);
		// validate data inside patch data against the dto
		const dto = plainToInstance(PatchAchievementDto, newDocument, {
			excludeExtraneousValues: true,
		});
		// apply changes
		const errors = await validate(dto, {
			whitelist: true,
			forbidNonWhitelisted: true,
		});

		if (errors.length > 0) {
			console.log('errors: ', errors);
			throw new BadRequestException(errors.toString());
		}

		return this.achievementRepo.patchOneById(achievement.id, newDocument);
	}
}
