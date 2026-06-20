import { IsString, IsNumber, IsOptional, IsEmail, IsNotEmpty } from "class-validator";


export class LoginDto{
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email : string;
}