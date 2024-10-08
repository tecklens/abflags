export const APPLICATION_CREATED = 'application-created';

// feature event types
export const FEATURE_CREATED = 'feature-created';
export const FEATURE_DELETED = 'feature-deleted';
export const FEATURE_UPDATED = 'feature-updated';
export const FEATURE_DEPENDENCY_ADDED = 'feature-dependency-added';
export const FEATURE_DEPENDENCY_REMOVED = 'feature-dependency-removed';
export const FEATURE_DEPENDENCIES_REMOVED =
  'feature-dependencies-removed';
export const FEATURE_METADATA_UPDATED = 'feature-metadata-updated';
export const FEATURE_VARIANTS_UPDATED = 'feature-variants-updated';
export const FEATURE_ENVIRONMENT_VARIANTS_UPDATED =
  'feature-environment-variants-updated';
export const FEATURE_PROJECT_CHANGE = 'feature-project-change';
export const FEATURE_ARCHIVED = 'feature-archived';
export const FEATURE_ENABLE = 'feature-enable';
export const FEATURE_REVIVED = 'feature-revived';
export const FEATURE_IMPORT = 'feature-import';
export const FEATURE_TAGGED = 'feature-tagged';
export const FEATURE_TAG_IMPORT = 'feature-tag-import';
export const FEATURE_STRATEGY_UPDATE = 'feature-strategy-update';
export const FEATURE_STRATEGY_ADD = 'feature-strategy-add';
export const FEATURE_STRATEGY_REMOVE = 'feature-strategy-remove';
export const DROP_FEATURE_TAGS = 'drop-feature-tags';
export const FEATURE_UNTAGGED = 'feature-untagged';
export const FEATURE_STALE_ON = 'feature-stale-on';
export const FEATURE_COMPLETED = 'feature-completed';
export const FEATURE_UNCOMPLETED = 'feature-uncompleted';
export const FEATURE_STALE_OFF = 'feature-stale-off';
export const DROP_FEATURES = 'drop-features';
export const FEATURE_ENVIRONMENT_ENABLED =
  'feature-environment-enabled';
export const FEATURE_ENVIRONMENT_DISABLED =
  'feature-environment-disabled';
export const STRATEGY_ORDER_CHANGED = 'strategy-order-changed';
export const STRATEGY_CREATED = 'strategy-created';
export const STRATEGY_DELETED = 'strategy-deleted';
export const STRATEGY_DEPRECATED = 'strategy-deprecated';
export const STRATEGY_REACTIVATED = 'strategy-reactivated';
export const STRATEGY_UPDATED = 'strategy-updated';
export const STRATEGY_IMPORT = 'strategy-import';
export const DROP_STRATEGIES = 'drop-strategies';
export const CONTEXT_FIELD_CREATED = 'context-field-created';
export const CONTEXT_FIELD_UPDATED = 'context-field-updated';
export const CONTEXT_FIELD_DELETED = 'context-field-deleted';
export const PROJECT_ACCESS_ADDED = 'project-access-added';
export const FEATURE_TYPE_UPDATED = 'feature-type-updated';

export const PROJECT_ACCESS_USER_ROLES_UPDATED =
  'project-access-user-roles-updated';

export const PROJECT_ACCESS_GROUP_ROLES_UPDATED =
  'project-access-group-roles-updated';

export const PROJECT_ACCESS_UPDATED = 'project-access-updated';

export const PROJECT_ACCESS_USER_ROLES_DELETED =
  'project-access-user-roles-deleted';

export const PROJECT_ACCESS_GROUP_ROLES_DELETED =
  'project-access-group-roles-deleted';

export const ROLE_CREATED = 'role-created';
export const ROLE_UPDATED = 'role-updated';
export const ROLE_DELETED = 'role-deleted';

export const PROJECT_CREATED = 'project-created';
export const PROJECT_UPDATED = 'project-updated';
export const PROJECT_DELETED = 'project-deleted';
export const PROJECT_ARCHIVED = 'project-archived';
export const PROJECT_REVIVED = 'project-revived';
export const PROJECT_IMPORT = 'project-import';
export const PROJECT_USER_ADDED = 'project-user-added';
export const PROJECT_USER_REMOVED = 'project-user-removed';
export const PROJECT_USER_ROLE_CHANGED = 'project-user-role-changed';
export const PROJECT_GROUP_ADDED = 'project-group-added';
export const PROJECT_GROUP_REMOVED = 'project-group-removed';
export const PROJECT_GROUP_ROLE_CHANGED = 'project-group-role-changed';
export const DROP_PROJECTS = 'drop-projects';
export const TAG_CREATED = 'tag-created';
export const TAG_DELETED = 'tag-deleted';
export const TAG_IMPORT = 'tag-import';
export const DROP_TAGS = 'drop-tags';
export const TAG_TYPE_CREATED = 'tag-type-created';
export const TAG_TYPE_DELETED = 'tag-type-deleted';
export const TAG_TYPE_UPDATED = 'tag-type-updated';
export const TAG_TYPE_IMPORT = 'tag-type-import';
export const DROP_TAG_TYPES = 'drop-tag-types';
export const ADDON_CONFIG_CREATED = 'addon-config-created';
export const ADDON_CONFIG_UPDATED = 'addon-config-updated';
export const ADDON_CONFIG_DELETED = 'addon-config-deleted';
export const DB_POOL_UPDATE = 'db-pool-update';
export const USER_CREATED = 'user-created';
export const USER_UPDATED = 'user-updated';
export const USER_DELETED = 'user-deleted';
export const DROP_ENVIRONMENTS = 'drop-environments';
export const ENVIRONMENT_IMPORT = 'environment-import';
export const ENVIRONMENT_CREATED = 'environment-created';
export const ENVIRONMENT_UPDATED = 'environment-updated';
export const ENVIRONMENT_DELETED = 'environment-deleted';
export const SEGMENT_CREATED = 'segment-created';
export const SEGMENT_UPDATED = 'segment-updated';
export const SEGMENT_DELETED = 'segment-deleted';

export const SEGMENT_IMPORT = 'segment-import';
export const GROUP_CREATED = 'group-created';
export const GROUP_UPDATED = 'group-updated';
export const GROUP_DELETED = 'group-deleted';
export const GROUP_USER_ADDED = 'group-user-added';
export const GROUP_USER_REMOVED = 'group-user-removed';
export const SETTING_CREATED = 'setting-created';
export const SETTING_UPDATED = 'setting-updated';
export const SETTING_DELETED = 'setting-deleted';
export const PROJECT_ENVIRONMENT_ADDED = 'project-environment-added';
export const PROJECT_ENVIRONMENT_REMOVED =
  'project-environment-removed';
export const DEFAULT_STRATEGY_UPDATED = 'default-strategy-updated';

export const CLIENT_METRICS = 'client-metrics';
export const CLIENT_METRICS_ADDED = 'client-metrics-added';
export const CLIENT_REGISTER = 'client-register';

export const PAT_CREATED = 'pat-created';
export const PAT_DELETED = 'pat-deleted';

export const PUBLIC_SIGNUP_TOKEN_CREATED =
  'public-signup-token-created';
export const PUBLIC_SIGNUP_TOKEN_USER_ADDED =
  'public-signup-token-user-added';
export const PUBLIC_SIGNUP_TOKEN_TOKEN_UPDATED =
  'public-signup-token-updated';

export const CHANGE_REQUEST_CREATED = 'change-request-created';
export const CHANGE_REQUEST_DISCARDED = 'change-request-discarded';
export const CHANGE_ADDED = 'change-added';
export const CHANGE_DISCARDED = 'change-discarded';
export const CHANGE_EDITED = 'change-edited';
export const CHANGE_REQUEST_APPROVED = 'change-request-approved';
export const CHANGE_REQUEST_REJECTED = 'change-request-rejected';
export const CHANGE_REQUEST_APPROVAL_ADDED =
  'change-request-approval-added';
export const CHANGE_REQUEST_CANCELLED = 'change-request-cancelled';
export const CHANGE_REQUEST_SENT_TO_REVIEW =
  'change-request-sent-to-review';
export const CHANGE_REQUEST_APPLIED = 'change-request-applied';
export const CHANGE_REQUEST_SCHEDULE_SUSPENDED =
  'change-request-schedule-suspended';
export const CHANGE_REQUEST_SCHEDULED = 'change-request-scheduled';
export const CHANGE_REQUEST_SCHEDULED_APPLICATION_SUCCESS =
  'change-request-scheduled-application-success';
export const CHANGE_REQUEST_SCHEDULED_APPLICATION_FAILURE =
  'change-request-scheduled-application-failure';
export const CHANGE_REQUEST_CONFIGURATION_UPDATED =
  'change-request-configuration-updated';

export const API_TOKEN_CREATED = 'api-token-created';
export const API_TOKEN_UPDATED = 'api-token-updated';
export const API_TOKEN_DELETED = 'api-token-deleted';

export const FEATURE_FAVORITED = 'feature-favorited';
export const FEATURE_UNFAVORITED = 'feature-unfavorited';
export const PROJECT_FAVORITED = 'project-favorited';
export const PROJECT_UNFAVORITED = 'project-unfavorited';
export const FEATURES_EXPORTED = 'features-exported';
export const FEATURES_IMPORTED = 'features-imported';

export const SERVICE_ACCOUNT_CREATED = 'service-account-created';
export const SERVICE_ACCOUNT_UPDATED = 'service-account-updated';
export const SERVICE_ACCOUNT_DELETED = 'service-account-deleted';

export const FEATURE_POTENTIALLY_STALE_ON =
  'feature-potentially-stale-on';

export const BANNER_CREATED = 'banner-created';
export const BANNER_UPDATED = 'banner-updated';
export const BANNER_DELETED = 'banner-deleted';

export const SIGNAL_ENDPOINT_CREATED = 'signal-endpoint-created';
export const SIGNAL_ENDPOINT_UPDATED = 'signal-endpoint-updated';
export const SIGNAL_ENDPOINT_DELETED = 'signal-endpoint-deleted';

export const SIGNAL_ENDPOINT_TOKEN_CREATED =
  'signal-endpoint-token-created';
export const SIGNAL_ENDPOINT_TOKEN_UPDATED =
  'signal-endpoint-token-updated';
export const SIGNAL_ENDPOINT_TOKEN_DELETED =
  'signal-endpoint-token-deleted';

export const ACTIONS_CREATED = 'actions-created';
export const ACTIONS_UPDATED = 'actions-updated';
export const ACTIONS_DELETED = 'actions-deleted';

export const IEventTypes = [
  APPLICATION_CREATED,
  FEATURE_CREATED,
  FEATURE_DELETED,
  FEATURE_UPDATED,
  FEATURE_METADATA_UPDATED,
  FEATURE_VARIANTS_UPDATED,
  FEATURE_ENVIRONMENT_VARIANTS_UPDATED,
  FEATURE_PROJECT_CHANGE,
  FEATURE_ARCHIVED,
  FEATURE_ENABLE,
  FEATURE_REVIVED,
  FEATURE_IMPORT,
  FEATURE_TAGGED,
  FEATURE_TAG_IMPORT,
  FEATURE_STRATEGY_UPDATE,
  FEATURE_STRATEGY_ADD,
  FEATURE_STRATEGY_REMOVE,
  FEATURE_TYPE_UPDATED,
  FEATURE_COMPLETED,
  FEATURE_UNCOMPLETED,
  STRATEGY_ORDER_CHANGED,
  DROP_FEATURE_TAGS,
  FEATURE_UNTAGGED,
  FEATURE_STALE_ON,
  FEATURE_STALE_OFF,
  DROP_FEATURES,
  FEATURE_ENVIRONMENT_ENABLED,
  FEATURE_ENVIRONMENT_DISABLED,
  STRATEGY_CREATED,
  STRATEGY_DELETED,
  STRATEGY_DEPRECATED,
  STRATEGY_REACTIVATED,
  STRATEGY_UPDATED,
  STRATEGY_IMPORT,
  DROP_STRATEGIES,
  CONTEXT_FIELD_CREATED,
  CONTEXT_FIELD_UPDATED,
  CONTEXT_FIELD_DELETED,
  PROJECT_ACCESS_ADDED,
  PROJECT_ACCESS_USER_ROLES_UPDATED,
  PROJECT_ACCESS_GROUP_ROLES_UPDATED,
  PROJECT_ACCESS_USER_ROLES_DELETED,
  PROJECT_ACCESS_GROUP_ROLES_DELETED,
  PROJECT_ACCESS_UPDATED,
  PROJECT_CREATED,
  PROJECT_UPDATED,
  PROJECT_DELETED,
  PROJECT_ARCHIVED,
  PROJECT_REVIVED,
  PROJECT_IMPORT,
  PROJECT_USER_ADDED,
  PROJECT_USER_REMOVED,
  PROJECT_USER_ROLE_CHANGED,
  PROJECT_GROUP_ROLE_CHANGED,
  PROJECT_GROUP_ADDED,
  PROJECT_GROUP_REMOVED,
  ROLE_CREATED,
  ROLE_UPDATED,
  ROLE_DELETED,
  DROP_PROJECTS,
  TAG_CREATED,
  TAG_DELETED,
  TAG_IMPORT,
  DROP_TAGS,
  TAG_TYPE_CREATED,
  TAG_TYPE_DELETED,
  TAG_TYPE_UPDATED,
  TAG_TYPE_IMPORT,
  DROP_TAG_TYPES,
  ADDON_CONFIG_CREATED,
  ADDON_CONFIG_UPDATED,
  ADDON_CONFIG_DELETED,
  DB_POOL_UPDATE,
  USER_CREATED,
  USER_UPDATED,
  USER_DELETED,
  DROP_ENVIRONMENTS,
  ENVIRONMENT_IMPORT,
  ENVIRONMENT_CREATED,
  ENVIRONMENT_UPDATED,
  ENVIRONMENT_DELETED,
  SEGMENT_CREATED,
  SEGMENT_UPDATED,
  SEGMENT_DELETED,
  GROUP_CREATED,
  GROUP_UPDATED,
  GROUP_DELETED,
  GROUP_USER_ADDED,
  GROUP_USER_REMOVED,
  SETTING_CREATED,
  SETTING_UPDATED,
  SETTING_DELETED,
  CLIENT_METRICS,
  CLIENT_REGISTER,
  PAT_CREATED,
  PAT_DELETED,
  PUBLIC_SIGNUP_TOKEN_CREATED,
  PUBLIC_SIGNUP_TOKEN_USER_ADDED,
  PUBLIC_SIGNUP_TOKEN_TOKEN_UPDATED,
  CHANGE_REQUEST_CREATED,
  CHANGE_REQUEST_DISCARDED,
  CHANGE_ADDED,
  CHANGE_DISCARDED,
  CHANGE_EDITED,
  CHANGE_REQUEST_REJECTED,
  CHANGE_REQUEST_APPROVED,
  CHANGE_REQUEST_APPROVAL_ADDED,
  CHANGE_REQUEST_CANCELLED,
  CHANGE_REQUEST_SENT_TO_REVIEW,
  CHANGE_REQUEST_SCHEDULE_SUSPENDED,
  CHANGE_REQUEST_APPLIED,
  CHANGE_REQUEST_SCHEDULED,
  CHANGE_REQUEST_SCHEDULED_APPLICATION_SUCCESS,
  CHANGE_REQUEST_SCHEDULED_APPLICATION_FAILURE,
  CHANGE_REQUEST_CONFIGURATION_UPDATED,
  API_TOKEN_CREATED,
  API_TOKEN_UPDATED,
  API_TOKEN_DELETED,
  FEATURE_FAVORITED,
  FEATURE_UNFAVORITED,
  PROJECT_FAVORITED,
  PROJECT_UNFAVORITED,
  FEATURES_EXPORTED,
  FEATURES_IMPORTED,
  SERVICE_ACCOUNT_CREATED,
  SERVICE_ACCOUNT_DELETED,
  SERVICE_ACCOUNT_UPDATED,
  FEATURE_POTENTIALLY_STALE_ON,
  FEATURE_DEPENDENCY_ADDED,
  FEATURE_DEPENDENCY_REMOVED,
  FEATURE_DEPENDENCIES_REMOVED,
  BANNER_CREATED,
  BANNER_UPDATED,
  BANNER_DELETED,
  PROJECT_ENVIRONMENT_ADDED,
  PROJECT_ENVIRONMENT_REMOVED,
  DEFAULT_STRATEGY_UPDATED,
  SEGMENT_IMPORT,
  SIGNAL_ENDPOINT_CREATED,
  SIGNAL_ENDPOINT_UPDATED,
  SIGNAL_ENDPOINT_DELETED,
  SIGNAL_ENDPOINT_TOKEN_CREATED,
  SIGNAL_ENDPOINT_TOKEN_UPDATED,
  SIGNAL_ENDPOINT_TOKEN_DELETED,
  ACTIONS_CREATED,
  ACTIONS_UPDATED,
  ACTIONS_DELETED,
]

export type IEventType = (typeof IEventTypes)[number];
