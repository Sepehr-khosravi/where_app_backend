import {IsString, IsEmail, IsNotEmpty} from "class-validator"



export class RegisterDto{
    @IsNotEmpty()
    @IsString()
    username : string;

    @IsNotEmpty()
    @IsEmail()
    email : string;
}