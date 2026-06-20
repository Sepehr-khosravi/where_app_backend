import { IsEmail, IsString, IsNotEmpty, Length } from "class-validator";


export class VerificationDto{
    @IsNotEmpty()
    @IsEmail()
    email : string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 6)
    code : string;
}