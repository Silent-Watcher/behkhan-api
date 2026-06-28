import { Environment } from '../enums/environment';

export const nodeEnv = process.env.NODE_ENV ?? Environment.Development;

export const isDevelopment = nodeEnv === Environment.Development;
export const isProduction = nodeEnv === Environment.Production;
export const isTest = nodeEnv === Environment.Test;

export const isNonProduction = !isProduction;
