import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	VersionColumn,
} from 'typeorm';

export abstract class AbstractEntity {
	@PrimaryGeneratedColumn({ unsigned: true })
	declare id: number;

	@CreateDateColumn()
	declare createdAt: Date;

	@UpdateDateColumn()
	declare updatedAt: Date;

	@VersionColumn()
	declare version: number;
}
