export enum EEnv {
  NODE_ENV = 'NODE_ENV',
  PORT = 'PORT',
  BCRYPT_SALT_ROUNDS = 'BCRYPT_SALT_ROUNDS',
  JWT_SECRET_KEY = 'JWT_SECRET_KEY',
  JWT_REFRESH_KEY = 'JWT_REFRESH_KEY',
}

export const ETable = {
  Carpark: 'carpark',
  User: 'user',
  FavoriteList: 'favorite-list',
};

export enum EGuardDecoratorKey {
  IS_PUBLIC_KEY = 'IS_PUBLIC_KEY',
}
