import {ConflictException, Injectable} from '@nestjs/common';
import {ProjectEntity, ProjectRepository} from "@repository/project";
import {
  FeatureStatus,
  IBaseEvent,
  ICalculateStatus,
  IJwtPayload,
  IPaginatedResponseDto, IProjectInsight,
  MemberRoleEnum,
  MemberStatusEnum,
  PROJECT_CREATED,
  ProjectDto,
  ProjectId, ProjectMode, variableDefault
} from '@abflags/shared';
import {MemberRepository} from "@repository/member";
import {CreateProjectDto, CreateVariableDto, GetVariableRequest, SearchProjectDto} from '@app/project/dtos';
import {EnvironmentService} from "@app/environment/environment.service";
import {VariableEntity, VariableRepository} from '@repository/variable';
import {ProjectStatsRepository} from "@repository/project-stats";
import {subDays} from "date-fns";
import {FeatureRepository} from "@repository/feature";
import {EventRepository} from "@repository/event";
import {Cron, CronExpression} from "@nestjs/schedule";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";
import {Transactional} from "typeorm-transactional";
import {Not} from "typeorm";
import {find, get} from "lodash";

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    private readonly projectStatsRepository: ProjectStatsRepository,
    private readonly memberRepository: MemberRepository,
    private readonly variableRepository: VariableRepository,
    private readonly environmentService: EnvironmentService,
    private readonly featureRepository: FeatureRepository,
    private readonly eventRepository: EventRepository,
    @InjectQueue('event') private eventQueue: Queue<IBaseEvent, string, string>,
  ) {
  }

  async getProject(u: IJwtPayload, payload: SearchProjectDto): Promise<ProjectDto[]> {
    const members = await this.memberRepository.findMemberByUserId(u._id)

    const rlt: ProjectEntity[] = await this.projectRepository.findByProjectIdIn(
      members.map(e => e._projectId),
      payload.sortType,
      payload.name
    );

    const countFlags = await this.featureRepository.countByProjectIds(rlt.map(e => e._id))

    return rlt.map(p => ({
      ...p,
      totalFlags: find(countFlags, e => e.projectId === p._id)?.totalFlag ?? 0,
      owner: {
        email: p.owner.email,
        firstName: p.owner.firstName,
        lastName: p.owner.lastName,
        _id: p.owner._id,
        profilePicture: p.owner.profilePicture,
      }
    }))
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

  async getVariablesActiveProject(u: IJwtPayload, payload: GetVariableRequest): Promise<IPaginatedResponseDto<VariableEntity>> {
    const rlt = await this.variableRepository.findByProjectId(u.projectId)

    return {
      page: payload.page,
      pageSize: payload.limit,
      data: rlt[0],
      total: rlt[1],
    }
  }

  async getById(u: IJwtPayload, id: string) {
    return this.projectRepository.findById(id);
  }

  @Transactional()
  async createProject(u: IJwtPayload, payload: CreateProjectDto) {
    const name = payload.name?.trim()
    if (await this.projectRepository.existByName(name)) {
      throw new ConflictException('Project name existed');
    }
    const createdProject = await this.projectRepository.save({
      logo: payload.logo,
      name: name,
      domain: payload.domain,
      description: payload.description,
      mode: ProjectMode.PRIVATE,
      createdBy: u._id,
      updatedBy: u._id,
    });

    await this.addMember({
      roles: [MemberRoleEnum.ADMIN],
      projectId: createdProject._id,
      userId: u._id,
      isDefault: true,
    });

    await this.variableRepository.save(variableDefault.map(e => ({
      name: e.name,
      _projectId: createdProject._id,
      type: e.type,
      isDefault: e.isDefault,
      required: e.required,
      createdBy: u._id,
      updatedBy: u._id,
    })))

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

    await this.eventQueue.add('action', {
      _projectId: createdProject._id,
      _environmentId: devEnv._id,
      type: PROJECT_CREATED,
      tags: ['project']
    })

    await this.eventQueue.add('action', {
      _projectId: createdProject._id,
      _environmentId: prodEnv._id,
      type: PROJECT_CREATED,
      tags: ['project']
    })

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

  @Cron(CronExpression.EVERY_30_SECONDS)
  async statsAllProjectJob() {
    const projects = await this.projectRepository.find();

    const statusUpdates = await Promise.all(
      projects.map((project) => this.getStatusUpdates(project._id)),
    );

    await this.projectStatsRepository.save(statusUpdates.map(e => ({
      _projectId: e.projectId,
      ...e.updates,
    })));
  }

  private async getStatusUpdates(projectId: string): Promise<ICalculateStatus> {
    const dateMinusThirtyDays = subDays(new Date(), 30);
    const dateMinusSixtyDays = subDays(new Date(), 60);

    const [
      createdCurrentWindow,
      createdPastWindow,
      archivedCurrentWindow,
      archivedPastWindow,
    ] = await Promise.all([
      await this.featureRepository.countByDate({
        project: projectId,
        dateAccessor: 'createdAt',
        date: dateMinusThirtyDays,
      }),
      await this.featureRepository.countByDate({
        project: projectId,
        dateAccessor: 'createdAt',
        range: [dateMinusSixtyDays, dateMinusThirtyDays],
      }),
      await this.featureRepository.countByDate({
        project: projectId,
        archived: true,
        dateAccessor: 'archivedAt',
        date: dateMinusThirtyDays,
      }),
      await this.featureRepository.countByDate({
        project: projectId,
        archived: true,
        dateAccessor: 'archivedAt',
        range: [dateMinusSixtyDays, dateMinusThirtyDays],
      }),
    ]);

    const [projectActivityCurrentWindow, projectActivityPastWindow] =
      await Promise.all([
        this.eventRepository.countByCurrentProjectWindow(projectId, dateMinusThirtyDays),
        this.eventRepository.countByPastProjectWindow(projectId, [dateMinusSixtyDays, dateMinusThirtyDays]),
      ]);

    const projectMembersAddedCurrentWindow =
      await this.memberRepository.getMembersCountByProjectAfterDate(
        projectId,
        dateMinusThirtyDays,
      );

    return {
      projectId,
      updates: {
        featuresCreatedCurrentWindow: createdCurrentWindow,
        featuresCreatedPastWindow: createdPastWindow,
        featuresArchivedCurrentWindow: archivedCurrentWindow,
        featuresArchivedPastWindow: archivedPastWindow,
        projectChangesCurrentWindow: projectActivityCurrentWindow,
        projectChangesPastWindow: projectActivityPastWindow,
        projectMembersAddedCurrentWindow: projectMembersAddedCurrentWindow,
      },
    };
  }

  async getProjectInsights(u: IJwtPayload): Promise<IProjectInsight> {
    const projectId = u.projectId;
    const [
      project,
      featureTypeCounts,
      projectStats,
      onboardingStatus,
    ] = await Promise.all([
      this.projectRepository.findById(projectId),
      this.featureRepository.getFeatureTypeCounts(
        projectId,
        u.environmentId,
        [FeatureStatus.ACTIVE, FeatureStatus.INACTIVE],
      ),
      this.projectStatsRepository.getFirstByProjectId(projectId),
      this.getOnboardingStatusProject(projectId),
    ]);

    return {
      stats: projectStats,
      name: project.name,
      description: project.description!,
      mode: project.mode,
      health: project.health || 0,
      updatedAt: project.updatedAt,
      archivedAt: project.archivedAt,
      createdAt: project.createdAt,
      onboardingStatus,
      featureTypeCounts,
      version: 1,
    };
  }

  /**
   * check onboard status project by last_seen_at_metric and feature table
   * @private
   */
  private async getOnboardingStatusProject(projectId: string) {
    const existFlag = await this.featureRepository.existsBy({
      _projectId: projectId,
      status: Not(FeatureStatus.ARCHIVE)
    })

    if (!existFlag) {
      return {status: 'onboarding-started'};
    }

    return {status: 'onboarded'};
  }

  async createVariable(u: IJwtPayload, payload: CreateVariableDto) {
    const name = payload.name.trim()
    if (await this.variableRepository.existByName(name, u.projectId)) {
      throw new ConflictException('Variable name existed')
    }
    return this.variableRepository.save({
      _projectId: u.projectId,
      name: name,
      defaultValue: payload.defaultValue,
      isDefault: false,
      required: payload.required,
      type: payload.type,
    })
  }
}
