import {DataSource, Repository} from 'typeorm';
import {UserEntity} from './user.entity';
import {Injectable} from '@nestjs/common';
import {createHash} from 'crypto';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(private dataSource: DataSource) {
    super(UserEntity, dataSource.createEntityManager());
  }

  findByEmail(email: string): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        email: email,
      },
    });
  }

  async findByEmailAndPassword(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    return this.findOneBy({
      email,
      password,
    });
  }

  findById(id: string): Promise<UserEntity | null> {
    return this.findOne({
      where: {
        _id: id,
      },
    });
  }

  getByEmail(email: string): Promise<UserEntity> {
    return this.findOneBy({
      email,
    });
  }

  async updatePasswordResetToken(
    userId: string,
    token: string,
  ) {
    return await this.update(
      {
        _id: userId,
      },
      {
        resetToken: this.hashResetToken(token),
      },
    );
  }

  async findUserByToken(token: string) {
    return await this.findOne({
      where: {
        resetToken: this.hashResetToken(token),
      },
    });
  }

  private hashResetToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
