import { IsInt } from "class-validator";
import { Type } from "class-transformer";

export class CancelInviteDto {
  @Type(() => Number)
  @IsInt()
  inviteId: number;
}