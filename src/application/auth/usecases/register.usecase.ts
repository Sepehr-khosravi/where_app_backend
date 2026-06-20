import { 
    Injectable,
    Inject,
    ConflictException,
    InternalServerErrorException
} from "@nestjs/common";
import { RegisterDto } from "../dto/register.dto";
import type { IUserRepository } from "src/domain/users/repository/user.repository.interface";
import type { ICodeGenerator } from "src/domain/auth/services/code-generator.interface";
import type { IVerificationCodeRepository } from "src/domain/auth/repositories/veryfication-code.repository.interface";
import type { IEmailSenderService } from "src/domain/auth/services/email-sender.interface";

@Injectable()
export class RegisterUseCase{
    private readonly PREFIX_TTL : number = 300;
    
    constructor(
        @Inject("IUserRepository") private readonly userRepo : IUserRepository,
        @Inject("ICodeGenerator") private readonly cryptoCode : ICodeGenerator,
        @Inject("IVerificationCodeRepository") private readonly verificationCode : IVerificationCodeRepository,
        @Inject("IEmailSenderService") private readonly emailSender : IEmailSenderService
    ){}

    async execute(dto : RegisterDto){
        try{
            //checking is user existed
            const isUserExist = await this.userRepo.checkExistingByEmail(dto.email);
            if(isUserExist){
                throw new ConflictException("User Already Exists")
            } 


            //create user

            const newUser = await this.userRepo.create({
                email : dto.email,
                username : dto.username,
            });

            //generating verification code.
            const verificationCode = this.cryptoCode.generate();

            //set the verification code with a special email in redis. 
            await this.verificationCode.set(dto.email, verificationCode, this.PREFIX_TTL);

            //send email
            await this.emailSender.sendVerificationCode(dto.email, verificationCode);

            return {
                message : "Created",
                user_id : newUser.id
            }

        }
        catch(e : any){
            if (e instanceof ConflictException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException("Internal Server Error!");
        }
    }
}