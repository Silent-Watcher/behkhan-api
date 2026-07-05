import { Controller } from '@nestjs/common';
import type { AchievementService } from './achievement.service.js';

@Controller('achievement')
export class AchievementController {
	constructor(private readonly achievementService: AchievementService) {}
}
