import {
	CreateDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
	VersionColumn,
} from 'typeorm';

export abstract class AbstractEntity {
	@PrimaryGeneratedColumn('uuid')
	declare id: string;

	@CreateDateColumn()
	declare createdAt: Date;

	@UpdateDateColumn()
	declare updatedAt: Date;

	@VersionColumn()
	declare version: number;
}
