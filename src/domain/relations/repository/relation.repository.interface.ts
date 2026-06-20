import { Invite } from "../entities/invite.entity";
import { Relationship } from "../entities/relation.entity";

export interface IRelationRepository {
  // INVITE
  createInvite(senderId: number, receiverId: number): Promise<Invite>;
  findInviteById(id: number): Promise<Invite | null>;
  findSentInvites(userId: number): Promise<Invite[]>;
  findExistingInvite(senderId: number,receiverId: number,) : Promise<Invite | null>;
  findReceivedInvites(userId: number): Promise<Invite[]>;
  findSentInviteById(id : number, senderUserId : number) : Promise<Invite | null>;
  findReceivedInviteById(id : number, reciverUserId : number) : Promise<Invite | null>; 
  updateInviteStatus(id: number, status: "PENDING" | "ACCEPTED" | "REJECTED"): Promise<Invite | null>;
  deleteInvite(id : number) : Promise<void>;

  // RELATIONSHIP
  createRelationship(userAId: number, userBId: number): Promise<Relationship>;
  findRelationByUserIdAndId(id : number, userId : number) : Promise<Relationship | null>;
  findAllRelations(userId: number): Promise<Relationship[]>;
  findRelationById(id : number) : Promise<Relationship | null>;
  deleteRelationship(id: number): Promise<void>;
}