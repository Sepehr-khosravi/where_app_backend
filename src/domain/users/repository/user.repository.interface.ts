
import { User } from "../entity/user";
import { GetUsersQueryDto } from "src/application/users/dto/get-all.dto";

export interface NewUserData {
  username: string;
  email: string;
  address?: string | null;
}
export interface UserUpdate{
    readonly email: string,
    isVerified: boolean,
}

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
}