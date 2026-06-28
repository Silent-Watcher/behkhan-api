import type { AdminModuleOptions, CustomLoader } from '@adminjs/nestjs';
import { registerAs } from '@nestjs/config';

export interface AdminPanelConfig extends AdminModuleOptions, CustomLoader {}

export default registerAs('adminPanel', () => {
	const config: AdminPanelConfig = {
		adminJsOptions: {
			rootPath: '/admin',
			resources: [],
		},
	};

	return config;
});
