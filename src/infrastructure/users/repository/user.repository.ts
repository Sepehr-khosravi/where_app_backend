import { Injectable } from "@nestjs/common";
import { GetUsersQueryDto } from "src/application/users/dto/get-all.dto";
import { User } from "src/domain/users/entity/user";
import { IUserRepository, NewUserData, UserUpdate } from "src/domain/users/repository/user.repository.interface";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      const record = await this.prisma.user.findUnique({ where: { email } });
      return record ? this.toDomain(record) : null;
    } catch (e: any) {
      throw new Error(`Failed to find user by email: ${e.message}`);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const record = await this.prisma.user.findUnique({ where: { id } });
      return record ? this.toDomain(record) : null;
    } catch (e: any) {
      throw new Error(`Failed to find user by id: ${e.message}`);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      const record = await this.prisma.user.findUnique({ where: { username } });
      return record ? this.toDomain(record) : null;
    } catch (e: any) {
      throw new Error(`Failed to find user by username: ${e.message}`);
    }
  }

  async findByEmailAndUsername(data: { email: string; username: string }): Promise<User | null> {
    try {
      const record = await this.prisma.user.findFirst({
        where: {
          email: data.email,
          username: data.username,
        },
      });
      return record ? this.toDomain(record) : null;
    } catch (e: any) {
      throw new Error(`Failed to find user: ${e.message}`);
    }
  }

  async checkExistingByEmail(email: string): Promise<boolean> {
    try {
      const record = await this.prisma.user.findUnique({ where: { email } });
      return !!record;
    } catch (e: any) {
      throw new Error(`Failed to check existing user: ${e.message}`);
    }
  }

  async checkExistingByUsername(username: string): Promise<boolean> {
    try {
      const record = await this.prisma.user.findUnique({ where: { username } });
      return !!record;
    } catch (e: any) {
      throw new Error(`Failed to check existing user: ${e.message}`);
    }
  }

  async create(data: NewUserData): Promise<User> {
    try {
      const record = await this.prisma.user.create({
        data: {
          email: data.email,
          username: data.username,
          isVerified: false,
        },
      });
      return this.toDomain(record);
    } catch (e: any) {
      throw new Error(`Failed to create user: ${e.message}`);
    }
  }

  async update(user: UserUpdate): Promise<User> {
    try {
      const record = await this.prisma.user.update({
        where: { email : user.email },
        data: {
          isVerified: user.isVerified,
        },
      });
      return this.toDomain(record);
    } catch (e: any) {
      throw new Error(`Failed to update user: ${e.message}`);
    }
  }

  async findAll(data: GetUsersQueryDto): Promise<User[] | null> {
    try{
      const record = await this.prisma.user.findMany({
        take : data.limit,
        ...(data.cursor && {
          cursor : {
            id : data.cursor
          },
          skip : 1
        })
      });

      return this.toDomainUsersForSearching(record);
    }
    catch(e : any){
      throw new Error(`Failed to get all users by infinit scrolling : ${e.message}`);
    }
  }

  private toDomainUsersForSearching(record: any): User[] {
    return record.map(element => this.toDomain(element));
  }

  private toDomain(record: any): User {
    return new User(
      record.id,
      record.username,
      record.email,
      record.isVerified,
    );
  }
}