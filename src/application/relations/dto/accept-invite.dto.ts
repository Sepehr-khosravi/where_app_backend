import { IsInt } from "class-validator";
import { Type } from "class-transformer";

export class AcceptInviteDto {
  @Type(() => Number)
  @IsInt()
  inviteId: number;
}