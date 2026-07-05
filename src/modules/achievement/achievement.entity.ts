import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';
import { AbstractEntity } from '#database/entities/abstract.entity.js';
import { UserEntity } from '#modules/user/user.entity.js';

@Entity('achievements')
export class AchievementEntity extends AbstractEntity {
	@Index()
	@Column({
		type: 'varchar',
		length: 50,
		nullable: false,
		unique: true,
	})
	declare name: string;

	@Column({
		type: 'integer',
		unsigned: true,
		nullable: false,
		unique: true,
	})
	declare minReadBookCount: number;

	@ManyToMany(() => UserEntity)
	@JoinTable()
	declare users: (UserEntity | null)[];
}
