export const ENV_VALIDATION_FAILED_MESSAGE = (msg: string): string => {
	return `Environment validation failed \n One or more required environment variables are missing or contain invalid values. \n Please review the errors below, update your environment configuration, and restart the application. \n ${msg}`;
};
