import { Environment } from '#enums/environment.js';

export const nodeEnv =
	process.env.APP_ENV ?? process.env.NODE_ENV ?? Environment.Development;

export const isDevelopment = nodeEnv === Environment.Development;
export const isProduction = nodeEnv === Environment.Production;
export const isTest = nodeEnv === Environment.Test;

export const isNonProduction = !isProduction;
