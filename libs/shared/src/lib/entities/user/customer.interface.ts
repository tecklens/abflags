export interface ICustomer {
  userId: string;
  environmentId: string;
  projectId: string;
  featureName: string;

  createdAt: Date;
  updatedAt: Date;
}
