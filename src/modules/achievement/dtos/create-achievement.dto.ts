import { Transform, Type } from 'class-transformer';
import {
	IsInt,
	IsNotEmpty,
	IsString,
	MaxLength,
	Min,
	MinLength,
} from 'class-validator';
import {
	MAXIMUM_ACHIEVEMENT_NAME_LENGTH,
	MINIMUM_ACHIEVEMENT_NAME_LENGTH,
} from '../achievement.constant.js';

export class CreateAchievementDto {
	@Transform(({ value }) =>
		typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : value,
	)
	@IsString()
	@IsNotEmpty()
	@MinLength(MINIMUM_ACHIEVEMENT_NAME_LENGTH)
	@MaxLength(MAXIMUM_ACHIEVEMENT_NAME_LENGTH)
	declare name: string;

	@Type(() => Number)
	@IsInt()
	@Min(0)
	declare minReadBookCount: number;
}
