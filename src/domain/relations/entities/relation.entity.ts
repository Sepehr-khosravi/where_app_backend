import { User } from "src/domain/users/entity/user";

export class Relationship {
  constructor(
    public readonly id: number,
    public readonly userAId: number,
    public readonly userBId: number,
    public readonly createdAt: Date,
    public readonly friend?: {
            id: number;
            username: string;
            email: string;
    },) {}


  static create(userAId: number, userBId: number, friend?: {
            id: number;
            username: string;
            email: string;
    } ): Relationship {
    const [a, b] = Relationship.normalize(userAId, userBId);

    return new Relationship(
      0, 
      a,
      b,
      new Date(),
      friend
    );
  }

  static normalize(userAId: number, userBId: number): [number, number] {
    return userAId < userBId
      ? [userAId, userBId]
      : [userBId, userAId];
  }

  isBetween(userId1: number, userId2: number): boolean {
    const [a, b] = Relationship.normalize(userId1, userId2);
    return this.userAId === a && this.userBId === b;
  }
}