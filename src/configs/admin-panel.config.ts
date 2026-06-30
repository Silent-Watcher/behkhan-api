import type { AdminModuleOptions, CustomLoader } from '@adminjs/nestjs';
import { registerAs } from '@nestjs/config';

export type AdminPanelConfig = AdminModuleOptions & CustomLoader;

export default registerAs('adminPanel', (): AdminPanelConfig => {
	const config: AdminPanelConfig = Object.freeze({
		adminJsOptions: {
			rootPath: '/admin',
			resources: [],
		},
	});

	return config;
});
