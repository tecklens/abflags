import AuthRepository from '@client/api/auth-repository'
import { get } from 'lodash'
import UserRepository from '@client/api/user-repository'
import EnvironmentRepository from '@client/api/environment-repository'
import ProjectRepository from '@client/api/project-repository'
import AnalysisRepository from '@client/api/analysis-repository'
import NotificationRepository from '@client/api/notification-repository'
import FileRepository from '@client/api/file-repository'
import FeatureRepository from "@client/api/feature-repository";

const repositories = {
  auth: AuthRepository,
  user: UserRepository,
  env: EnvironmentRepository,
  project: ProjectRepository,
  anal: AnalysisRepository,
  noti: NotificationRepository,
  file: FileRepository,
  feature: FeatureRepository,
}

export const RepositoryFactory: {
  get: (name: 'auth' | 'user' | 'env' | 'project' | 'feature' | 'anal' | 'file') => any
} = {
  get: (name: 'auth' | 'user' | 'env' | 'project' | 'feature' | 'anal' | 'file') => get(repositories, name)
}
