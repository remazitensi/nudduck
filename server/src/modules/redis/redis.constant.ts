const getEnvVar = (varName: string): string => {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`환경 변수 ${varName}가 정의되지 않았습니다.`);
  }
  return value;
};

export const REDIS_HOST = getEnvVar('REDIS_HOST');
export const REDIS_PORT = parseInt(getEnvVar('REDIS_PORT'), 10);
export const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
export const REDIS_DB = parseInt(getEnvVar('REDIS_DB'), 10);
export const REDIS_CHANNEL = getEnvVar('REDIS_CHANNEL');
