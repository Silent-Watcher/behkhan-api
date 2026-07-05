import { PartialType } from '@nestjs/swagger';
import { CreateAchievementDto } from './create-achievement.dto.js';

export class PatchAchievementDto extends PartialType(CreateAchievementDto) {}
