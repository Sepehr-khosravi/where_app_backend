import { IsInt } from "class-validator";
import { Type } from "class-transformer";

export class SendInviteDto {
  @Type(() => Number)
  @IsInt()
  receiverId: number;

  @Type(()=> Number)
  @IsInt()
  senderId : number;
}