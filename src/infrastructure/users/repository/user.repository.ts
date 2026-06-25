import { Injectable } from "@nestjs/common";
import { GetUsersQueryDto } from "src/application/users/dto/get-all.dto";
import { User } from "src/domain/users/entity/user";
import { IUserRepository, NewUserData, UserSearched, UserUpdate } from "src/domain/users/repository/user.repository.interface";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

//dto
import { SearchUsersQueryDto } from "src/application/users/dto/search.dto";
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
      const record = await this.prisma.user.findUnique({
         where: { id } ,
         select : {
          email : true,
          username : true,
          id : true
         }
      });
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

  async findAll(data: GetUsersQueryDto): Promise<User[] | null> 
  { 
    try{ 
      const record = await this.prisma.user.findMany({ 
        take : data.limit, 
        ...(data.cursor && { 
          cursor : { 
            id : data.cursor 
          }, skip : 1 
        }) 
      }); 
      return this.toDomainUsersForSearching(record); 
    } catch(e : any){ 
      throw new Error(`Failed to get all users by infinit scrolling : ${e.message}`); 
    } 
  }

  async searchUsers(
    currentUserId: number,
    dto: SearchUsersQueryDto,
  ): Promise<UserSearched[]> {
    try {
      const records = await this.prisma.user.findMany({
        where: {
          id: {
            not: currentUserId,
          },
          username: {
            contains: dto.search,
            mode: "insensitive",
          },
        },
        include: {
          sentInvites: {
            where: {
              receiverId: currentUserId,
            },
            select: {
              status: true,
            },
          },
          receivedInvites: {
            where: {
              senderId: currentUserId,
            },
            select: {
              status: true,
            },
          },
        },
        take: dto.limit,
        ...(dto.cursor && {
          cursor: {
            id: dto.cursor,
          },
          skip: 1,
        }),
        orderBy: {
          id: "asc",
        },
      });
  
      return records ? this.toDomainUsersSearched(records) : [];
  
    } catch (e: any) {
  
      throw new Error(
  
        `Failed to search users: ${e.message}`,
  
      );
  
    }
  
  }

  private toDomainUsersSearched(records : any) : UserSearched[]{
    return records.map((record) => {
      return this.toDomainUserSearched(record);
    });
  }

  private toDomainUserSearched(record : any) : UserSearched{
    const invite =
        record.sentInvites[0] ??
        record.receivedInvites[0];


    return new UserSearched(
        record.id,
        record.username,
        record.email,
        record.isVerified,
        invite?.status ?? null,
    );
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