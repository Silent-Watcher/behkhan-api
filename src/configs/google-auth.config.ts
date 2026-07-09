import _env from '#bootstrap/setup-env.js';
import { registerAs } from '@nestjs/config';

export default registerAs('googleAuth', () =>
	Object.freeze({
		clientID: _env.GOOGLE_CLIENT_ID,
		clientSecret: _env.GOOGLE_CLIENT_SECRET,
		callbackURL: _env.GOOGLE_CALLBACK_URL,
	} as const),
);
