import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller.js';
import { UserEntity } from './user.entity.js';
import { UserService } from './user.service.js';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [UserController],
	providers: [UserService],
})
export class UserModule {}
