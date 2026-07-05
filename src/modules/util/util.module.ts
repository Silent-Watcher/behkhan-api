import { Module } from '@nestjs/common';
import { ApiUtilService } from './api-util.service.js';

@Module({
	providers: [ApiUtilService],
	exports: [ApiUtilService],
})
export class UtilModule {}
