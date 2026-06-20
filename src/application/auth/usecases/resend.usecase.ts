import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException
} from "@nestjs/common";
import { ResendVerificationCodeDto } from "../dto/resend.dto";
import type { IUserRepository } from "src/domain/users/repository/user.repository.interface";
import type { IVerificationCodeRepository } from "src/domain/auth/repositories/veryfication-code.repository.interface";
import type { ICodeGenerator } from "src/domain/auth/services/code-generator.interface";
import type { IEmailSenderService } from "src/domain/auth/services/email-sender.interface";

@Injectable()
export class ResendVerificationCodeUseCase{
    private readonly PREFIX_TTL = 300;
    constructor(
        @Inject("IUserRepository") private readonly userRepo : IUserRepository,
        @Inject("IVerificationCodeRepository") private readonly verificationCode : IVerificationCodeRepository,
        @Inject("ICodeGenerator") private readonly cryptoCode : ICodeGenerator,
        @Inject("IEmailSenderService") private readonly emailSender : IEmailSenderService
    ){};

    async exectue(dto : ResendVerificationCodeDto){
        try{
            //check existing 
            const isUserExist = await this.userRepo.checkExistingByEmail(dto.email);
            if(!isUserExist){
                throw new NotFoundException("User Not Found!");
            };

            //check existing verification code in redis
            const verificationCode = await this.verificationCode.get(dto.email);
            if(verificationCode){
                throw new BadRequestException("Please Wait For 5Min Later To Get A New Verification Code!");
            };

            //generating new verification code.
            const newVerificationCode =  this.cryptoCode.generate();

            //save that into redis
            await this.verificationCode.set(dto.email, newVerificationCode, this.PREFIX_TTL);

            //send a new email to user
            await this.emailSender.sendVerificationCode(dto.email, newVerificationCode);

            return {
                message : "ok"
            };  
        }
        catch(e : any){
            if (e instanceof NotFoundException || e instanceof BadRequestException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException("Internal Server Error!");
        };
    }
}