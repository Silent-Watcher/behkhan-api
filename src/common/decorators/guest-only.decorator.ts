import { SetMetadata } from '@nestjs/common';
export const IS_GUEST_ONLY = 'isGuestOnly';

export const GuestOnly = () => SetMetadata(IS_GUEST_ONLY, true);
