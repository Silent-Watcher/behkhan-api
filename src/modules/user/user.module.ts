import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserByIdPipe } from './pipes/user-by-id.pipe.js';
import { UserController } from './user.controller.js';
import { UserEntity } from './user.entity.js';
import { UserRepository } from './user.repository.js';
import { UserService } from './user.service.js';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [UserController],
	providers: [UserService, UserRepository, UserByIdPipe],
	exports: [UserService, UserByIdPipe],
})
export class UserModule {}
