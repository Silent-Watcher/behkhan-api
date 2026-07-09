import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import googleAuthConfig from '../../../configs/google-auth.config.js';
import type { ConfigType } from '@nestjs/config';
import type { Profile } from 'passport';
import { AuthProvider } from '#enums/auth.js';
import { UserEntity } from '#modules/user/user.entity.js';
import { DataSource } from 'typeorm';
import { ExternalIdentityEntity } from '../external-identity.entity.js';
import { UserService } from '#modules/user/user.service.js';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		@Inject(googleAuthConfig.KEY)
		private readonly googleAuthConf: ConfigType<typeof googleAuthConfig>,
		private readonly dataSource: DataSource,
		@Inject(forwardRef(() => UserService))
		private readonly userService: UserService,
	) {
		super({
			clientID: googleAuthConf.clientID,
			clientSecret: googleAuthConf.clientSecret,
			callbackURL: googleAuthConf.callbackURL,
			scope: ['email', 'profile'],
		});
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: Profile,
	) {
		const { emails, id: providerId } = profile;

		const returnedEmail = emails?.[0]['verified'] ? emails[0].value : null;

		if (!returnedEmail)
			throw new BadRequestException(
				'Requested Email Not Verified by Google',
			);

		const userExistsWithReturnedEmail =
			await this.userService.findOneByIdentifier(returnedEmail);

		if (userExistsWithReturnedEmail) {
			const externalIdentity =
				await this.userService.findOneByExternalIdentity(
					providerId,
					AuthProvider.GOOGLE,
				);

			if (externalIdentity) {
				return externalIdentity.user;
			}

			const newExternalIdentity = new ExternalIdentityEntity();
			newExternalIdentity.provider = AuthProvider.GOOGLE;
			newExternalIdentity.providerUserId = providerId;
			newExternalIdentity.user = userExistsWithReturnedEmail;

			await this.dataSource.manager.save(newExternalIdentity);

			return userExistsWithReturnedEmail;
		}

		const queryRunner = this.dataSource.createQueryRunner();
		try {
			await queryRunner.connect();
			await queryRunner.startTransaction();

			const newUser = new UserEntity();
			newUser.email = returnedEmail;

			const newExternalIdentity = new ExternalIdentityEntity();
			newExternalIdentity.provider = AuthProvider.GOOGLE;
			newExternalIdentity.providerUserId = providerId;

			newExternalIdentity.user = newUser;

			await queryRunner.manager.save(newUser);
			await queryRunner.manager.save(newExternalIdentity);

			await queryRunner.commitTransaction();
			return newUser;
		} catch (error) {
			await queryRunner.rollbackTransaction();
			throw error;
		} finally {
			await queryRunner.release();
		}
	}
}
