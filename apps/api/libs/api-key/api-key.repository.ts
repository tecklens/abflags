import {DataSource, Repository} from "typeorm";
import {ApiKeyEntity} from "@repository/api-key/api-key.entity";
import {EncryptedSecret, IApiKey} from "@abflags/shared";
import {Injectable} from "@nestjs/common";

@Injectable()
export class ApiKeyRepository extends Repository<ApiKeyEntity> {
  constructor(private dataSource: DataSource) {
    super(ApiKeyEntity, dataSource.createEntityManager());
  }

  async getApiKeys(environmentId: string): Promise<IApiKey[]> {
    return await this.findBy(
      {
        _environmentId: environmentId,
      },
    );
  }

  async findByApiKey({hash}: {hash: string}): Promise<ApiKeyEntity> {
    return await this.findOne({
      where: {
        hash: hash,
      },
      relations: ['environment', 'user']
    })
  }
}
