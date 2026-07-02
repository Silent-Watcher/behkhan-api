import { SetMetadata } from '@nestjs/common';
export const BLOCK_IF_AUTHENTICATED = 'block_if_authenticated' as const;

export const BlockIfAuthenticated = () =>
	SetMetadata(BLOCK_IF_AUTHENTICATED, true);
