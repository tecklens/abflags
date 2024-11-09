import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {FeatureEntity, FeatureRepository, FeatureStrategyRepository} from "@repository/feature";
import {
  ConditionGroupState,
  FEATURE_ARCHIVED,
  FEATURE_CREATED,
  FEATURE_ENABLE,
  FeatureId,
  FeatureStatus,
  FeatureStrategyId,
  FeatureStrategyStatus,
  IBaseEvent,
  IFeatureStrategy,
  IJwtPayload,
  IPaginatedResponseDto,
  Operator
} from "@abflags/shared";
import {
  AnalysisCustomerRequest,
  CreateFeatureRequestDto,
  CreateStrategyRequest,
  FeatureDto,
  FrontendFeatureRequest,
  GetFeatureRequestDto, UpdateFeatureDescriptionRequest,
  UpdateStrategyRequest
} from "@app/feature/dtos";
import {Transactional} from "typeorm-transactional";
import {InjectQueue} from "@nestjs/bullmq";
import {Queue} from "bullmq";
import {cloneDeep, get, reduce} from "lodash";
import {normalizedStrategyValue} from "@client/utils/normalize";
import {Cron, CronExpression} from "@nestjs/schedule";
import {CustomerInsightsEntity, CustomerInsightsRepository, CustomerRepository} from "@repository/user";
import {ProjectRepository} from "@repository/project";
import {format} from "date-fns";

@Injectable()
export class FeatureService {
  private unsavedCustomer: Record<string, any>

  constructor(
    private readonly featureRepository: FeatureRepository,
    private readonly featureStrategyRepository: FeatureStrategyRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly customerInsightsRepository: CustomerInsightsRepository,
    private readonly projectRepository: ProjectRepository,
    @InjectQueue('event') private eventQueue: Queue<IBaseEvent, string, string>,
  ) {
    this.unsavedCustomer = {}
  }

  async getByActiveProject(u: IJwtPayload, payload: GetFeatureRequestDto): Promise<IPaginatedResponseDto<FeatureEntity>> {
    const rlt = await this.featureRepository.getByEnvIdAndProjectId(
      u.environmentId,
      u.projectId,
      payload.name,
      payload.status,
      payload.page * payload.limit,
      payload.limit,
    )
    return {
      page: payload.page,
      pageSize: payload.limit,
      data: rlt[0],
      total: rlt[1],
    }
  }

  async createFeature(u: IJwtPayload, payload: CreateFeatureRequestDto) {
    const name = payload.name.trim();
    if (await this.featureRepository.existByName(name, u.projectId)) {
      throw new ConflictException('Feature name is existed')
    }

    const newFeature = await this.featureRepository.save({
      _environmentId: u.environmentId,
      _projectId: u.projectId,
      createdBy: u.email,
      updatedBy: u.email,
      name: payload.name,
      description: payload.description,
      status: payload.status,
      type: payload.type,
      tags: payload.tags,
    })

    await this.eventQueue.add('action', {
      _projectId: u.projectId,
      _environmentId: u.environmentId,
      tags: ['feature'],
      type: FEATURE_CREATED,
      featureId: newFeature._id
    })

    return newFeature;
  }

  async getByApiKey(u: IJwtPayload, payload: GetFeatureRequestDto): Promise<IPaginatedResponseDto<FeatureDto>> {
    const rlt = await this.featureRepository.getByEnvIdAndProjectId(
      u.environmentId,
      u.projectId,
      null,
      null,
      payload.page * payload.limit,
      payload.limit,
    )
    return {
      page: payload.page,
      pageSize: payload.limit,
      data: rlt[0]?.map(e => ({
        _id: e._id,
        name: e.name,
        status: e.status,
        behavior: e.behavior,
      })),
      total: rlt[1],
    }
  }

  async getFeatureById(u: IJwtPayload, id: FeatureId) {
    return this.featureRepository.getByEnvironmentIdAndId(
      u.environmentId,
      id,
    )
  }

  @Transactional()
  async archive(u: IJwtPayload, id: FeatureId) {
    const feature = await this.featureRepository.getByEnvironmentIdAndId(
      u.environmentId,
      id,
    )

    if (!feature) throw new NotFoundException();

    await this.eventQueue.add('action', {
      _projectId: u.projectId,
      _environmentId: u.environmentId,
      type: FEATURE_ARCHIVED,
      featureId: id,
      tags: ['feature']
    })

    return this.featureRepository.save({
      ...feature,
      status: FeatureStatus.ARCHIVE,
      archivedAt: new Date(),
    })
  }

  @Transactional()
  async enable(u: IJwtPayload, id: FeatureId) {
    const feature = await this.featureRepository.getByEnvironmentIdAndId(
      u.environmentId,
      id,
    )

    if (!feature) throw new NotFoundException();

    await this.eventQueue.add('action', {
      _projectId: u.projectId,
      _environmentId: u.environmentId,
      type: FEATURE_ENABLE,
      featureId: id,
      tags: ['feature', 'enable']
    })

    return this.featureRepository.save({
      ...feature,
      status: FeatureStatus.ACTIVE,
      archivedAt: new Date(),
    })
  }

  async createStrategy(u: IJwtPayload, id: FeatureId, payload: CreateStrategyRequest) {
    const numCurrentOfStrategy = await this.featureStrategyRepository.countCurrentStrategy(id)
    return this.featureStrategyRepository.save({
      featureId: id,
      conditions: payload.conditions,
      name: payload.name,
      sortOrder: payload.sortOrder,
      description: payload.description,
      status: payload.status,
      createdBy: u._id,
      updatedBy: u._id,
      percentage: payload.percentage,
      stickiness: payload.stickiness,
      groupId: payload.groupId,
      order: numCurrentOfStrategy + 1,
    })
  }

  async updateStrategy(u: IJwtPayload, id: FeatureId, payload: UpdateStrategyRequest) {
    return this.featureStrategyRepository.update({
      featureId: id,
      _id: payload.id,
    }, {
      conditions: payload.conditions,
      name: payload.name,
      sortOrder: payload.sortOrder,
      description: payload.description,
      status: payload.status,
      updatedBy: u._id,
      percentage: payload.percentage,
      stickiness: payload.stickiness,
      groupId: payload.groupId,
    })
  }

  async updateFeatureDescription(u: IJwtPayload, id: FeatureId, payload: UpdateFeatureDescriptionRequest) {
    return this.featureRepository.update({
      _id: id,
      _environmentId: u.environmentId,
      _projectId: u.projectId,
    }, {
      description: payload.description,
    })
  }

  async getAllStrategy(u: IJwtPayload, id: FeatureId) {
    return this.featureStrategyRepository.find({
      where: {
        featureId: id,
      },
      order: {
        order: 'ASC',
        createdAt: 'DESC'
      }
    })
  }

  async updateOrderStrategy(u: IJwtPayload, strategies: IFeatureStrategy[]) {
    return this.featureStrategyRepository.save(strategies.map((e, index) => ({...e, order: index,})))
  }

  async disableStrategy(u: IJwtPayload, id: FeatureId, strategyId: FeatureStrategyId) {
    const strategy = await this.featureStrategyRepository.findOneBy({
      featureId: id,
      _id: strategyId
    })

    if (!strategy) throw new NotFoundException();

    return this.featureStrategyRepository.save({
      ...strategy,
      status: FeatureStrategyStatus.INACTIVE
    })
  }

  async enableStrategy(u: IJwtPayload, id: FeatureId, strategyId: FeatureStrategyId) {
    const strategy = await this.featureStrategyRepository.findOneBy({
      featureId: id,
      _id: strategyId
    })

    if (!strategy) throw new NotFoundException();

    return this.featureStrategyRepository.save({
      ...strategy,
      status: FeatureStrategyStatus.ACTIVE
    })
  }

  async deleteStrategy(u: IJwtPayload, id: FeatureId, strategyId: FeatureStrategyId) {
    const strategy = await this.featureStrategyRepository.findOneBy({
      featureId: id,
      _id: strategyId
    })

    if (!strategy) throw new NotFoundException();

    return this.featureStrategyRepository.remove(strategy)
  }

  async getFrontendFeature(u: IJwtPayload, context: FrontendFeatureRequest): Promise<FeatureDto[]> {
    const features = await this.featureRepository.getAllFeatureByProjectId(
      u.environmentId,
      u.projectId
    );

    let finalFeature: FeatureEntity[] = [];
    for (let feature of features) {
      let finalEnabled = false;

      if (feature.strategies && feature.strategies.length > 0) {
        for (let strategy of feature.strategies) {
          if (strategy.status !== FeatureStrategyStatus.ACTIVE) continue;
          // * check gradual rollout
          // * if stickiness not exist in context
          const valueStickiness = get(context, strategy.stickiness)
          if (!valueStickiness) {
            continue;
          }

          const percentage = Number(strategy.percentage);
          const groupId = strategy.groupId || '';

          const normalizedUserId = normalizedStrategyValue(valueStickiness, groupId);

          // * check percentage rollout
          let isEnabled = percentage > 0 && normalizedUserId <= percentage;

          if (!isEnabled) continue;

          isEnabled = reduce(strategy.conditions, (rlt, e) => {
            return rlt && this.checkConditional(context, e)
          }, isEnabled)
          if (isEnabled) {
            finalEnabled = true
            break;
          }
        }
      } else {
        finalEnabled = true;
      }

      if (finalEnabled) {
        finalFeature = [...finalFeature, feature];
      }
    }

    this.unsavedCustomer[context.userId + u.environmentId] = {
      userId: context.userId,
      environmentId: u.environmentId,
      projectId: u.projectId,
    }

    return finalFeature.map(e => ({
      name: e.name,
      _id: e._id,
      behavior: e.behavior,
      status: e.status,
      tags: e.tags,
      _projectId: e._projectId,
      type: e.type
    }));
  }

  private checkConditional(values: any, conditions: ConditionGroupState) {
    const operators = {
      [Operator.IS_EQUAL_TO]: function (a, b) {
        return a == b;
      },
      [Operator.MORE_THAN]: function (a, b) {
        return a > b;
      },
      [Operator.LESS_THAN]: function (a, b) {
        return a < b;
      },
      [Operator.MORE_THAN_EQUAL]: function (a, b) {
        return a >= b;
      },
      [Operator.LESS_THAN_EQUAL]: function (a, b) {
        return a <= b;
      },
      [Operator.IS_NOT_EQUAL_TO]: function (a, b) {
        return a != b;
      },
      [Operator.IN]: function (a, b) {
        return Array.isArray(b) ? b.find((f) => f.text == a) : false;
      },
      [Operator.NOT_IN]: function (a, b) {
        return Array.isArray(b) ? !b.find((f) => f.text == a) : false;
      },
    };
    if (conditions?.rules) {
      let rlt = conditions.operator === 'and';
      for (const rule of conditions.rules) {
        const variable = rule.variable;
        const operator = rule.operator;
        const value = rule.value;

        const targetValue = get(values, variable);

        if (!targetValue) return false;

        const executor = get(operators, operator);
        if (typeof executor === 'function') {
          const c = executor(targetValue, value);

          if (conditions.operator === 'and') rlt = rlt && c;
          else rlt = rlt || c;
        }
      }

      if (conditions.groups && conditions.groups.length > 0) {
        const groupRlt = conditions.groups.reduce((rlt, e) => {
          const c1 = this.checkConditional(values, e);
          if (conditions.operator === 'and') return rlt && c1;
          else return rlt || c1;
        }, conditions.operator === 'and');

        if (conditions.operator === 'and') rlt = rlt && groupRlt;
        else rlt = rlt || groupRlt;
      }

      return rlt;
    }
  }

  async getFeatureByType(u: IJwtPayload) {
    const rlt = await this.featureRepository.groupByType(u.environmentId)

    return reduce(rlt, (r, v) => ({
      ...r,
      [v.type]: v.value
    }), {})
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async saveCustomerFromFeature() {
    if (this.unsavedCustomer) {
      const copy = cloneDeep(this.unsavedCustomer)
      this.unsavedCustomer = {}
      await this.customerRepository.save(Object.values(copy))
    }
  }

  // @Cron(CronExpression.EVERY_2_HOURS)
  // async clearCustomerLogAfterNMonth() {
  //   await this.customerRepository.clearAfter(process.env.NUM_MONTH_CLEAR_CUSTOMER_LOG
  //     ? parseInt(process.env.NUM_MONTH_CLEAR_CUSTOMER_LOG)
  //     : 1)
  // }

  /**
   *
   */
  @Cron('0 59 * * * *')
  async analysisTotalCustomerEveryHour() {
    const hour = format(new Date(), "yyyy-MM-dd HH");
    const projects = await this.projectRepository.findBy({});

    const start = new Date();
    start.setHours(start.getHours(), 0, 0, 0);

    const end = new Date();
    end.setHours(end.getHours() + 1, 0, 0, 0);

    let insights: CustomerInsightsEntity[] = []
    for (let project of projects) {
      insights = [...insights, {
        hour: hour,
        projectId: project._id,
        totalUser: await this.customerRepository.countByProjectInHours(project._id, start, end)
      }]
    }

    await this.customerInsightsRepository.save(insights);
  }

  async analysisCustomerByHour(u: IJwtPayload, payload: AnalysisCustomerRequest) {
    return {
      series: await this.customerInsightsRepository.find({
        where: {
          projectId: u.projectId
        },
        skip: payload.page * payload.limit,
        take: payload.limit,
        order: {
          createdAt: 'DESC'
        }
      }),
      total: await this.customerRepository.countBy({
        projectId: u.projectId,
      }),
    }
  }
}
