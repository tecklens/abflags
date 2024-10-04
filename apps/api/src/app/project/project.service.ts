import {Injectable} from '@nestjs/common';
import {ProjectEntity, ProjectRepository} from "@repository/project";
import {IJwtPayload, MemberRoleEnum, MemberStatusEnum, ProjectDto} from "@abflags/shared";
import {MemberRepository} from "@repository/member";
import {CreateProjectDto} from "@app/project/dtos";
import {EnvironmentService} from "@app/environment/environment.service";

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly memberRepository: MemberRepository,
    private readonly environmentService: EnvironmentService,
  ) {
  }

  async getProject(u: IJwtPayload) {
    const members = await this.memberRepository.findMemberByUserId(u._id)

    return this.projectRepository.findByProjectIdIn(members.map(e => e._projectId));
  }

  async getActiveProject(u: IJwtPayload): Promise<ProjectDto> {
    const rlt = await this.projectRepository.findById(u.projectId);

    return {
      _id: rlt._id,
      name: rlt.name,
      description: rlt.description,
      domain: rlt.domain,

      numMembers: await this.memberRepository.countByProject(rlt._id)
    }
  }

  async getMembersActiveProject(u: IJwtPayload) {
    return this.memberRepository.findMemberByProjectId(u.projectId)
  }

  async getById(u: IJwtPayload, id: string) {
    return this.projectRepository.findById(id);
  }

  async createProject(u: IJwtPayload, payload: CreateProjectDto) {
    const createdProject = await this.projectRepository.save({
      logo: payload.logo,
      name: payload.name,
      domain: payload.domain,
      description: payload.description,
    });

    await this.addMember({
      roles: [MemberRoleEnum.ADMIN],
      projectId: createdProject._id,
      userId: u._id,
      isDefault: true,
    });

    const devEnv = await this.environmentService.createEnvironment(
      {
        plan: u.plan,
        _id: u._id,
        projectId: createdProject._id,
        environmentId: '',
        exp: 0,
        roles: [],
      },
      {
        name: 'DEV',
        parentId: '',
      },
      null,
    );

    const prodEnv = await this.environmentService.createEnvironment(
      {
        plan: u.plan,
        _id: u._id,
        projectId: createdProject._id,
        environmentId: '',
        exp: 0,
        roles: [],
      },
      {
        name: 'PROD',
        parentId: '',
      },
      devEnv._id,
    );

    return {
      project: createdProject as ProjectEntity,
      environmentId: devEnv._id,
    };
  }

  private async addMember({
                            projectId,
                            userId,
                            roles,
                            isDefault,
                          }: {
    projectId: string;
    userId: string;
    roles: MemberRoleEnum[];
    isDefault: boolean;
  }) {
    await this.memberRepository.addMember(
      projectId,
      {
        _userId: userId,
        roles: roles,
        memberStatus: MemberStatusEnum.ACTIVE,
      },
      isDefault,
    );
  }
}
