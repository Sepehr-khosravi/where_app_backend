import { IsEmail, IsNotEmpty } from "class-validator";


export class ResendVerificationCodeDto{
    @IsNotEmpty()
    @IsEmail()
    email : string;
}