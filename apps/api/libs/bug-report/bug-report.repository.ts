import {BugReportEntity} from './bug-report.entity';
import {DataSource, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class BugReportRepository extends Repository<BugReportEntity> {
  constructor(private dataSource: DataSource) {
    super(BugReportEntity, dataSource.createEntityManager());
  }
}
