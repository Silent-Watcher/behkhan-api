import { registerAs } from '@nestjs/config';
import _env from '#bootstrap/setup-env.js';

export default registerAs('googleAuth', () =>
	Object.freeze({
		clientID: _env.GOOGLE_CLIENT_ID,
		clientSecret: _env.GOOGLE_CLIENT_SECRET,
		callbackURL: _env.GOOGLE_CALLBACK_URL,
	} as const),
);
