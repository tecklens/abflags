import {createHash as createHashCrypto} from "crypto";

const createHash = (apiKey: string): string => {
  const hash = createHashCrypto('sha256');
  hash.update(apiKey);

  return hash.digest('hex');
};

const buildAuthServiceKey = ({ apiKey }: { apiKey: string }): string => {
  const apiKeyHash = createHash(apiKey);

  return buildKeyById({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.AUTH_SERVICE,
    identifier: apiKeyHash,
    identifierPrefix: IdentifierPrefixEnum.API_KEY,
  });
};
/**
 * Use this to build a key for entities that are scoped to an environment
 */
export const buildCommonKey = ({
  type,
  keyEntity,
  environmentIdPrefix = OrgScopePrefixEnum.ENVIRONMENT_ID,
  environmentId,
  identifierPrefix = IdentifierPrefixEnum.ID,
  identifier,
}: {
  type: CacheKeyTypeEnum;
  keyEntity: CacheKeyPrefixEnum;
  environmentIdPrefix?: OrgScopePrefixEnum;
  environmentId: string;
  identifierPrefix?: IdentifierPrefixEnum;
  identifier: string;
}): string =>
  prefixWrapper(
    `${type}:${keyEntity}:${environmentIdPrefix}=${environmentId}:${identifierPrefix}=${identifier}`,
  );

/**
 * Use this to build a key for entities that are scoped to an environment
 */
export const buildCommonEnvironmentKey = ({
  type,
  keyEntity,
  environmentIdPrefix = OrgScopePrefixEnum.ENVIRONMENT_ID,
  environmentId,
}: {
  type: CacheKeyTypeEnum;
  keyEntity: CacheKeyPrefixEnum;
  environmentIdPrefix?: OrgScopePrefixEnum;
  environmentId: string;
}): string =>
  prefixWrapper(`${type}:${keyEntity}:${environmentIdPrefix}=${environmentId}`);

/**
 * Use this to build a key for entities that are unscoped (do not belong to a hierarchy)
 */
const buildKeyById = ({
  type,
  keyEntity,
  identifierPrefix = IdentifierPrefixEnum.ID,
  identifier,
}: {
  type: CacheKeyTypeEnum;
  keyEntity: CacheKeyPrefixEnum;
  identifierPrefix?: IdentifierPrefixEnum;
  identifier: string;
}): string =>
  prefixWrapper(`${type}:${keyEntity}:${identifierPrefix}=${identifier}`);

export function prefixWrapper(prefixString: string) {
  return `{${prefixString}}`;
}

export const QUERY_PREFIX = '#query#';

export enum CacheKeyPrefixEnum {
  MESSAGE_COUNT = 'message_count',
  FEED = 'feed',
  SUBSCRIBER = 'subscriber',
  NOTIFICATION_TEMPLATE = 'notification_template',
  USER = 'user',
  INTEGRATION = 'integration',
  ENVIRONMENT_BY_API_KEY = 'environment_by_api_key',
  GROUPED_BLUEPRINTS = 'grouped-blueprints',
  AUTH_SERVICE = 'auth_service',
  MAXIMUM_API_RATE_LIMIT = 'maximum_api_rate_limit',
  EVALUATE_API_RATE_LIMIT = 'evaluate_api_rate_limit',
  SERVICE_CONFIG = 'service_config',
}

export enum CacheKeyTypeEnum {
  ENTITY = 'entity',
  QUERY = 'query',
}

export enum IdentifierPrefixEnum {
  ID = 'i',
  SUBSCRIBER_ID = 's',
  TEMPLATE_IDENTIFIER = 't_i',
  API_KEY = 'a_k',
  GROUPED_BLUEPRINT = 'g_b',
  API_RATE_LIMIT_CATEGORY = 'a_r_l_c',
  SERVICE_CONFIG = 's_c',
}

export enum ServiceConfigIdentifierEnum {
  API_RATE_LIMIT_SERVICE_MAXIMUM = 'api_rate_limit_service_maximum',
}

export enum OrgScopePrefixEnum {
  ENVIRONMENT_ID = 'e',
  ORGANIZATION_ID = 'o',
}

export const BLUEPRINT_IDENTIFIER = 'blueprints/group-by-category';

const buildSubscriberKey = ({
  subscriberId,
  _environmentId,
}: {
  subscriberId: string;
  _environmentId: string;
}): string =>
  buildCommonKey({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.SUBSCRIBER,
    environmentId: _environmentId,
    identifierPrefix: IdentifierPrefixEnum.SUBSCRIBER_ID,
    identifier: subscriberId,
  });

const buildUserKey = ({ _id }: { _id: string }): string =>
  buildKeyById({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.USER,
    identifier: _id,
  });

const buildNotificationTemplateKey = ({
  _id,
  _environmentId,
}: {
  _id: string;
  _environmentId: string;
}): string =>
  buildCommonKey({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.NOTIFICATION_TEMPLATE,
    environmentId: _environmentId,
    identifierPrefix: IdentifierPrefixEnum.ID,
    identifier: _id,
  });

const buildNotificationTemplateIdentifierKey = ({
  templateIdentifier,
  _environmentId,
}: {
  templateIdentifier: string;
  _environmentId: string;
}): string =>
  buildCommonKey({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.NOTIFICATION_TEMPLATE,
    environmentId: _environmentId,
    identifierPrefix: IdentifierPrefixEnum.TEMPLATE_IDENTIFIER,
    identifier: templateIdentifier,
  });

const buildEnvironmentByApiKey = ({ apiKey }: { apiKey: string }): string =>
  buildKeyById({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.ENVIRONMENT_BY_API_KEY,
    identifier: apiKey,
    identifierPrefix: IdentifierPrefixEnum.API_KEY,
  });

const buildGroupedBlueprintsKey = (environmentId: string): string =>
  buildCommonKey({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.GROUPED_BLUEPRINTS,
    environmentIdPrefix: OrgScopePrefixEnum.ORGANIZATION_ID,
    environmentId: environmentId,
    identifierPrefix: IdentifierPrefixEnum.GROUPED_BLUEPRINT,
    identifier: BLUEPRINT_IDENTIFIER,
  });

const buildMaximumApiRateLimitKey = ({
  apiRateLimitCategory,
  _environmentId,
}: {
  apiRateLimitCategory: string;
  _environmentId: string;
}): string =>
  buildCommonKey({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.MAXIMUM_API_RATE_LIMIT,
    environmentId: _environmentId,
    identifierPrefix: IdentifierPrefixEnum.API_RATE_LIMIT_CATEGORY,
    identifier: apiRateLimitCategory,
  });

const buildEvaluateApiRateLimitKey = ({
  apiRateLimitCategory,
  _environmentId,
}: {
  apiRateLimitCategory: string;
  _environmentId: string;
}): string =>
  buildCommonKey({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.EVALUATE_API_RATE_LIMIT,
    environmentId: _environmentId,
    identifierPrefix: IdentifierPrefixEnum.API_RATE_LIMIT_CATEGORY,
    identifier: apiRateLimitCategory,
  });

const buildServiceConfigKey = (
  identifier: ServiceConfigIdentifierEnum,
): string =>
  buildKeyById({
    type: CacheKeyTypeEnum.ENTITY,
    keyEntity: CacheKeyPrefixEnum.SERVICE_CONFIG,
    identifierPrefix: IdentifierPrefixEnum.SERVICE_CONFIG,
    identifier,
  });

const buildServiceConfigApiRateLimitMaximumKey = (): string =>
  buildServiceConfigKey(
    ServiceConfigIdentifierEnum.API_RATE_LIMIT_SERVICE_MAXIMUM,
  );

export {
  buildUserKey,
  buildSubscriberKey,
  buildNotificationTemplateKey,
  buildNotificationTemplateIdentifierKey,
  buildEnvironmentByApiKey,
  buildKeyById,
  buildGroupedBlueprintsKey,
  buildMaximumApiRateLimitKey,
  buildEvaluateApiRateLimitKey,
  buildServiceConfigApiRateLimitMaximumKey,
  buildAuthServiceKey,
};
