import {
    Injectable,
    Inject,
    BadRequestException,
    InternalServerErrorException
} from "@nestjs/common";
import { LoginDto } from "../dto/login.dto";
import type { IUserRepository } from "src/domain/users/repository/user.repository.interface";
import type { IVerificationCodeRepository } from "src/domain/auth/repositories/veryfication-code.repository.interface";
import type { IEmailSenderService } from "src/domain/auth/services/email-sender.interface";
import type { ICodeGenerator } from "src/domain/auth/services/code-generator.interface";

@Injectable()
export class LoginUseCase{
    private readonly PREFIX_TTL = 300;
    
    constructor(
        @Inject("IUserRepository") private readonly userRepo : IUserRepository,
        @Inject("IVerificationCodeRepository") private readonly verificationCode : IVerificationCodeRepository,
        @Inject("IEmailSenderService") private readonly emailSender : IEmailSenderService,
        @Inject("ICodeGenerator") private readonly cryptoCode : ICodeGenerator
    ){};

    async execute(dto : LoginDto){
        try{
            //check existing
            const isUserExist = await this.userRepo.checkExistingByEmail(dto.email);
            if(!isUserExist){
                throw new BadRequestException("Bad Request, PLease Try Again!"); 
            }
            //generating code
            const verificationCode = this.cryptoCode.generate();

            //saving verificationCode and email in redis
            this.verificationCode.set(dto.email, verificationCode, this.PREFIX_TTL);

            //send email 
            this.emailSender.sendVerificationCode(dto.email, verificationCode);

            return {
                message : "OK"
            };
            
        }
        catch(e : any){
            if (e instanceof BadRequestException) throw e;
            
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException("Internal Server Error!");
        };
    }
}