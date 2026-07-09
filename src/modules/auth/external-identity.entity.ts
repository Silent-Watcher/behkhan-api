import type { Relation } from 'typeorm';
import { Column, Entity, In, Index, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '#database/entities/abstract.entity.js';
import { AuthProvider } from '#enums/auth.js';
import { UserEntity } from '#modules/user/user.entity.js';

@Entity('external_identities')
@Unique('UQ_provider_providerUserId', ['provider', 'providerUserId'])
export class ExternalIdentityEntity extends AbstractEntity {
	@Column({
		type: 'enum',
		enum: AuthProvider,
	})
	@Index('IDX_provider', ['provider'])
	declare provider: string;

	@Column({
		type: 'varchar',
		length: 255,
	})
	declare providerUserId: string;

	@ManyToOne(
		() => UserEntity,
		(user) => user.identities,
		{
			nullable: false,
			onDelete: 'CASCADE',
		},
	)
	declare user: Relation<UserEntity>;
}
