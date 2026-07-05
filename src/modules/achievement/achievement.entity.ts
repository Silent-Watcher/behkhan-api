import { AbstractEntity } from '#database/entities/abstract.entity.js';
import { UserEntity } from '#modules/user/user.entity.js';
import { Column, Entity, Index, JoinTable, ManyToMany } from 'typeorm';

@Entity()
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
		type: 'int64',
		unsigned: true,
		nullable: false,
	})
	declare minReadBookCount: number;

	@ManyToMany(() => UserEntity)
	@JoinTable()
	declare users: (UserEntity | null)[];
}
