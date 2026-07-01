import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '#database/entities/abstract.entity.js';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
	@Column({
		type: 'varchar',
		length: 254,
		unique: true,
		nullable: true,
	})
	declare email: string | null;

	@Column({
		type: 'varchar',
		length: 20,
		unique: true,
		nullable: true,
	})
	declare phone: string | null;

	@Column({
		type: 'varchar',
		length: 100,
		select: false,
		nullable: true,
	})
	declare password: string | null;

	@Column({
		type: 'varchar',
		length: 32,
		unique: true,
		nullable: true,
	})
	declare username: string | null;

	@Index()
	@Column({
		type: 'varchar',
		length: 100,
		nullable: true,
	})
	declare displayName: string | null;
}
