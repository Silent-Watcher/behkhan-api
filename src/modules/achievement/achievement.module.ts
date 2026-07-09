import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementController } from './achievement.controller.js';
import { AchievementEntity } from './achievement.entity.js';
import { AchievementRepository } from './achievement.repository.js';
import { AchievementService } from './achievement.service.js';
import { UtilModule } from '#modules/util/util.module.js';

@Module({
	imports: [TypeOrmModule.forFeature([AchievementEntity]), UtilModule],
	controllers: [AchievementController],
	providers: [AchievementService, AchievementRepository],
	exports: [AchievementService],
})
export class AchievementModule {}
