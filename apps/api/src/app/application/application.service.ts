import {Injectable} from '@nestjs/common';
import {ApplicationRepository} from "@repository/application";
import {APPLICATION_CREATED, IBaseEvent, IJwtPayload} from "@abflags/shared";
import {CreateApplicationDto} from "@app/application/dtos";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    @InjectQueue('event') private eventQueue: Queue<IBaseEvent, string, string>,
  ) {
  }

  async getAll(u: IJwtPayload) {
    return this.applicationRepository.findBy({
      _projectId: u.projectId,
    });
  }

  async createApplication(u: IJwtPayload, payload: CreateApplicationDto) {
    const name = payload.appName.trim()
    const existed = await this.applicationRepository.findOneBy({
      _projectId: u.projectId,
      appName: name,
    })

    if (existed) return existed;

    await this.eventQueue.add('action', {
      _projectId: u.projectId,
      type: APPLICATION_CREATED,
      tags: ['project', 'application'],
      _environmentId: u.environmentId,
    })
    return this.applicationRepository.save({
      _projectId: u.projectId,
      appName: name,
      createdBy: u._id,
      updatedBy: u._id,
    })
  }
}
