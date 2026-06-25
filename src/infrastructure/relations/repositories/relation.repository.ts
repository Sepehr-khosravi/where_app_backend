import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/infrastructure/prisma/prisma.service";

import { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";
import { Invite } from "src/domain/relations/entities/invite.entity";
import { Relationship } from "src/domain/relations/entities/relation.entity";

@Injectable()
export class RelationRepositoryImpl implements IRelationRepository {
  constructor(private readonly prisma: PrismaService) {}

  // INVITE SECTION

  async createInvite(senderId: number, receiverId: number): Promise<Invite> {
    try{
      const record = await this.prisma.invite.create({
        data: {
          senderId,
          receiverId,
          status: "PENDING",
        },
      });
    
      return this.toInviteDomain(record);
    }
    catch(e : any){
      throw new Error(`Failed to create a new invite : ${e.message}`);
    }
  }

  async findInviteById(id: number): Promise<Invite | null> {
    const record = await this.prisma.invite.findUnique({
      where: { id},
    });

    return record ? this.toInviteDomain(record) : null;
  }

  async findSentInvites(userId: number): Promise<Invite[]> {
    const records = await this.prisma.invite.findMany({
      where: { senderId: userId },
      include : {
        receiver : {
          select : {
            id : true,
            email : true,
            username : true
          }
        }
      },
    });

    return records.map((r) => this.toSentInviteDomain(r));
  }

  async findReceivedInvites(userId: number): Promise<Invite[] > {
    const records = await this.prisma.invite.findMany({
      where: { receiverId: userId },
      include : {
        sender : {
          select : {
            id : true,
            username : true,
            email : true
          }
        }
      }
    });

    return records.map((r) => this.toInviteDomain(r));
  }

  async updateInviteStatus(
    id: number,
    status: "PENDING" | "ACCEPTED" | "REJECTED",
  ): Promise<Invite | null> {
    const record = await this.prisma.invite.update({
      where: { id },
      data: { status },
    });

    return record ? this.toInviteDomain(record) : null;
  }

  async findExistingInvite(
      senderId: number,
      receiverId: number,
  ): Promise<Invite | null> {
  
      const record = await this.prisma.invite.findFirst({
          where: {
              OR: [
                  {
                      senderId,
                      receiverId,
                  },
                  {
                      senderId: receiverId,
                      receiverId: senderId,
                  },
              ],
          },
      });
  
      return record ? this.toInviteDomain(record) : null;
  }
  
  async findSentInviteById(
      id: number,
      senderUserId: number,
  ): Promise<Invite | null> {
      try {
          const record =
              await this.prisma.invite.findFirst({
                  where: {
                      id,
                      senderId: senderUserId,
                  },
              });
  
          return record
              ? this.toInviteDomain(record)
              : null;
      } catch (e: any) {
          throw new Error(
              `Failed to find sent invite: ${e.message}`,
          );
      }
  }
  async findReceivedInviteById(
      id: number,
      receiverUserId: number,
  ): Promise<Invite | null> {
      try {
          const record =
              await this.prisma.invite.findFirst({
                  where: {
                      id,
                      receiverId: receiverUserId,
                  },
              });
  
          return record
              ? this.toInviteDomain(record)
              : null;
      } catch (e: any) {
          throw new Error(
              `Failed to find received invite: ${e.message}`,
          );
      }
  }

  async deleteInvite(id: number): Promise<void> {
    try{
      await this.prisma.invite.delete({
        where : {
          id
        }
      });
    }
    catch(e : any){
      throw new Error(`Failed to delete an invite : ${e.message}`);
    }
  }

  // RELATIONSHIP SECTION

  async createRelationship(userAId: number, userBId: number): Promise<Relationship> {
    const [a, b] = this.normalize(userAId, userBId);

    const record = await this.prisma.relationship.create({
      data: {
        userAId: a,
        userBId: b,
      },
    });

    return this.toRelationDomain(record);
  }

  async findRelationById(id: number): Promise<Relationship | null> {
    try{
      const record = await this.prisma.relationship.findUnique({
        where : {
          id,
        }
      });

      return record ? this.toRelationDomain(record) : null;
    }
    catch(e : any){
      throw new Error(`Failed to find a relationship by id : ${e.message}`);
    }
  }

  async findAllRelations(
      userId: number,
      limit: number = 20,
      cursor?: number,
  ): Promise<Relationship[]> {
      const records =
          await this.prisma.relationship.findMany({
              where: {
                  OR: [
                      { userAId: userId },
                      { userBId: userId },
                  ],
              },
              include: {
                  userA: true,
                  userB: true,
              },
              take: limit,
              skip: cursor ? 1 : 0,
              cursor: cursor
                  ? { id: cursor }
                  : undefined,
              orderBy: {
                  id: "desc",
              },
          });
  
      return records.map((record) => {
          const otherUser =
              record.userAId === userId
                  ? record.userB
                  : record.userA;
  
          return this.toRelationDomain({
              ...record,
              friend: {
                  id: otherUser.id,
                  username: otherUser.username,
                  email: otherUser.email,
              },
          });
      });
  }

  async findRelationByUserIdAndId(
      id: number,
      userId: number,
  ): Promise<Relationship | null> {
      try {
          const record =
              await this.prisma.relationship.findFirst({
                  where: {
                      id,
                      OR: [
                          { userAId: userId },
                          { userBId: userId },
                      ],
                  },
                  include: {
                      userA: true,
                      userB: true,
                  },
              });
  
          if (!record) {
              return null;
          }
  
          const otherUser =
              record.userAId === userId
                  ? record.userB
                  : record.userA;
  
          return this.toRelationDomain({
              ...record,
              friend: {
                  id: otherUser.id,
                  username: otherUser.username,
                  email: otherUser.email,
              },
          });
      } catch (e: any) {
          throw new Error(
              `Failed to find relation: ${e.message}`,
          );
      }
  }
  async deleteRelationship(id: number): Promise<void> {
    try{
      await this.prisma.relationship.delete({
        where: { id },
      });
    }
    catch(e : any){
      throw new Error(`Failed to delelte a relation ship : ${e.message}`);
    }
  }

  // MAPPERS

  private toSentInviteDomain(record : any) : Invite{
    return new Invite(
      record.id,
      record.senderId,
      record.receiverId,
      record.status,
      record.createdAt,
      record.receiver ? record.receiver : null
    )
  }

  private toInviteDomain(record: any): Invite {
    return new Invite(
      record.id,
      record.senderId,
      record.receiverId,
      record.status,
      record.createdAt,
      record.sender ? record.sender : null
    );
  }

  private toRelationDomain(
      record: any,
  ): Relationship {
      return new Relationship(
          record.id,
          record.userAId,
          record.userBId,
          record.createdAt,
          record.friend,
      );
  }

  // UTILS

  private normalize(a: number, b: number): [number, number] {
    return a < b ? [a, b] : [b, a];
  }
}