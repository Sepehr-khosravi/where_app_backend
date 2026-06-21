
import { SearchUsersQueryDto } from "src/application/users/dto/search.dto";
import { User } from "../entity/user";
import { GetUsersQueryDto } from "src/application/users/dto/get-all.dto";

//invite status interface 
import { InviteStatus } from "src/domain/relations/entities/invite.entity";

export interface NewUserData {
  username: string;
  email: string;
}
export interface UserUpdate{
    readonly email: string,
    isVerified: boolean,
}

export class UserSearched{
  constructor(
    readonly id : number,
    readonly username : string,
    readonly email : string,
    isVerified : boolean,
    inviteStatus : InviteStatus 
  ){};
};

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByEmailAndUsername(data: { email: string; username: string }): Promise<User | null>;
  checkExistingByEmail(email: string): Promise<boolean>;
  checkExistingByUsername(username: string): Promise<boolean>;
  create(data: NewUserData): Promise<User>;
  findAll(data : GetUsersQueryDto) : Promise<User[] | null>;
  update(user: UserUpdate): Promise<User>;
  searchUsers(currentUserId : number, dto : SearchUsersQueryDto) : Promise<UserSearched[]>
}