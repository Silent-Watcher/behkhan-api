import { SetMetadata } from '@nestjs/common';
export const IS_PUBLIC_TOKEN = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_TOKEN, true);
