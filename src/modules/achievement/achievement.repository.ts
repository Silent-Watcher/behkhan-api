import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere, Repository } from 'typeorm';
import { AchievementEntity } from './achievement.entity.js';

@Injectable()
export class AchievementRepository {
	constructor(
		@InjectRepository(AchievementEntity)
		private readonly achievementRepository: Repository<AchievementEntity>,
	) {}

	save(achievement: AchievementEntity): Promise<AchievementEntity> {
		return this.achievementRepository.save(achievement);
	}

	findOneByNameOrReadBookCount(
		name: string,
		projection?: Partial<Record<keyof AchievementEntity, boolean>>,
		readBookCount?: number,
	): Promise<AchievementEntity | null> {
		const whereClause: FindOptionsWhere<AchievementEntity>[] | undefined = [
			{ name },
		];

		if (readBookCount) {
			whereClause.push({ minReadBookCount: readBookCount });
		}

		return this.achievementRepository.findOne({
			where: whereClause,
			select: projection,
		});
	}

	findOneById(
		id: number,
		projection?: Partial<Record<keyof AchievementEntity, boolean>>,
	): Promise<AchievementEntity | null> {
		return this.achievementRepository.findOne({
			where: [{ id }],
			select: projection,
		});
	}

	async patchOneById(id: number, patchData: AchievementEntity) {
		const { minReadBookCount, name } = patchData;
		const result = await this.achievementRepository
			.createQueryBuilder()
			.update(AchievementEntity)
			.set({
				name,
				minReadBookCount,
			})
			.where('id = :id', { id })
			.returning('*')
			.execute();

		const updated = result.raw[0];
		return updated;
	}
}
