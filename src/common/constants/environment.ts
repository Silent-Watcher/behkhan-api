import _env from '#bootstrap/setup-env.js';
import { Environment } from '#enums/environment.js';

export const nodeEnv = _env.APP_ENV ?? _env.NODE_ENV ?? Environment.Development;

export const isDevelopment = nodeEnv === Environment.Development;
export const isProduction = nodeEnv === Environment.Production;
export const isTest = nodeEnv === Environment.Test;

export const isNonProduction = !isProduction;
