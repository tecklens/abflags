import AuthRepository from '@client/api/auth-repository'
import { get } from 'lodash'
import UserRepository from '@client/api/user-repository'
import EnvironmentRepository from '@client/api/environment-repository'
import ProjectRepository from '@client/api/project-repository'
import MetricRepository from '@client/api/metric-repository'
import NotificationRepository from '@client/api/notification-repository'
import FileRepository from '@client/api/file-repository'
import FeatureRepository from "@client/api/feature-repository";
import EventRepository from "@client/api/event-repository";
import ApplicationRepository from "@client/api/application-repository";

const repositories = {
  auth: AuthRepository,
  user: UserRepository,
  env: EnvironmentRepository,
  project: ProjectRepository,
  metric: MetricRepository,
  noti: NotificationRepository,
  file: FileRepository,
  feature: FeatureRepository,
  event: EventRepository,
  app: ApplicationRepository,
}

export const RepositoryFactory: {
  get: (name: 'auth' | 'user' | 'env' | 'project' | 'feature' | 'metric' | 'file' | 'event' | 'app') => any
} = {
  get: (name: 'auth' | 'user' | 'env' | 'project' | 'feature' | 'metric' | 'file' | 'event' | 'app') => get(repositories, name)
}
