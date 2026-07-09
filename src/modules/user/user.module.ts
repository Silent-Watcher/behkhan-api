import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserByIdPipe } from './pipes/user-by-id.pipe.js';
import { UserController } from './user.controller.js';
import { UserEntity } from './user.entity.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';
import { ExternalIdentityEntity } from '#modules/auth/external-identity.entity.js';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity,ExternalIdentityEntity])],
	controllers: [UserController],
	providers: [UserService, UserRepository, UserByIdPipe],
	exports: [UserService, UserByIdPipe],
})
export class UserModule {}
