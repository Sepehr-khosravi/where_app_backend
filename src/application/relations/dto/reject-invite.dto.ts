import { IsInt } from "class-validator";
import { Type } from "class-transformer";

export class RejectInviteDto {
  @Type(() => Number)
  @IsInt()
  inviteId: number;
}