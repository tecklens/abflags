import { BugReportId, UserId } from '../../types';

export interface IBugReport {
  id?: BugReportId;
  title: string;
  description: string;
  ip: string;

  _userId: UserId;

  createdAt?: Date;
}
