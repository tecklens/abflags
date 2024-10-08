import {DataSource, MoreThanOrEqual, Repository} from "typeorm";
import {AddMemberDto} from "@app/auth/dtos";
import {MemberEntity} from "@repository/member";
import {Injectable} from "@nestjs/common";
import {ProjectId} from "@abflags/shared";

@Injectable()
export class MemberRepository extends Repository<MemberEntity> {
  constructor(private dataSource: DataSource) {
    super(MemberEntity, dataSource.createEntityManager());
  }

  async findByUserIdAndProjectId(
    projectId: string,
    userId: string,
  ): Promise<MemberEntity | null> {
    return await this.findOneBy({
      _projectId: projectId,
      _userId: userId,
    });
  }

  async findMemberByUserId(
    userId: string,
  ): Promise<MemberEntity[]> {
    return await this.findBy({
      _userId: userId,
    });
  }

  async findMemberByProjectId(
    projectId: string,
  ): Promise<MemberEntity[]> {
    return await this.find({
      where: {
        _projectId: projectId,
      },
      relations: ['user']
    });
  }

  async isMemberOfProject(
    projectId: string,
    userId: string,
  ): Promise<boolean> {
    return this.existsBy(
      {
        _projectId: projectId,
        _userId: userId,
      },
    );
  }

  async addMember(
    projectId: string,
    member: AddMemberDto,
    isDefault: boolean,
  ): Promise<void> {
    await this.save({
      _userId: member._userId,
      roles: member.roles,
      invite: member.invite,
      memberStatus: member.memberStatus,
      _projectId: projectId,
      isDefault,
    });
  }

  async countByProject(projectId: ProjectId) {
    return this.countBy({
      _projectId: projectId
    })
  }

  async getMembersCountByProjectAfterDate(
    projectId: string,
    date: Date,
  ) {
    return this.countBy({
      _projectId: projectId,
      createdAt: MoreThanOrEqual(date),
    })
  }
}
