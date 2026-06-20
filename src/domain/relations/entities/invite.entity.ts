import { InviteSender } from "./invite-sender.entity";
export type InviteStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export class Invite {
  constructor(
    public readonly id: number,
    public readonly senderId: number,
    public readonly receiverId: number,
    public status: InviteStatus,
    public readonly createdAt: Date,
    public readonly sender : InviteSender | null
  ) {}

  static create(senderId: number, receiverId: number, sender : InviteSender | null): Invite {
    return new Invite(
      0,
      senderId,
      receiverId,
      "PENDING",
      new Date(),
      sender
    );
  }

  accept() {
    this.status = "ACCEPTED";
  }

  reject() {
    this.status = "REJECTED";
  }

  isPending(): boolean {
    return this.status === "PENDING";
  }
}