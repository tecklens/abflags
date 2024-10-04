import { UserPlan } from '../../entities';

export interface IJwtPayload {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  profilePicture?: string;
  projectId: string;
  environmentId: string;
  roles: string[];
  exp: number;
  plan: UserPlan;
}

export enum ApiAuthSchemeEnum {
  BEARER = 'Bearer',
  API_KEY = 'ApiKey',
}

export enum PassportStrategyEnum {
  JWT = 'jwt',
  HEADER_API_KEY = 'apikey',
  GITHUB = 'github',
  GOOGLE = 'google',
  LOCAL = 'local',
}
