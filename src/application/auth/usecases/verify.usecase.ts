import {
    Injectable,
    Inject,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from "@nestjs/common";
import { VerificationDto } from "../dto/verification.dto";
import type { IUserRepository } from "src/domain/users/repository/user.repository.interface";
import type { IVerificationCodeRepository } from "src/domain/auth/repositories/veryfication-code.repository.interface";
import type { IJwtRepository } from "src/domain/auth/repositories/jwt.repository.interface";


@Injectable()
export class VerifyUseCase{
    constructor(
        @Inject("IUserRepository") private readonly userRepo : IUserRepository,
        @Inject("IVerificationCodeRepository") private readonly verificationCode : IVerificationCodeRepository,
        @Inject("IJwtRepository") private readonly jwtRepo : IJwtRepository
    ){};


    async execute(dto :VerificationDto){
        try{
            //check existing
            const isUserExist = await this.userRepo.checkExistingByEmail(dto.email);
            if (!isUserExist){
                throw new NotFoundException("User Not Found");
            }

            //checking is user verification code exist?
            const verificationCode = await this.verificationCode.get(dto.email);
            if(!verificationCode){
                throw new NotFoundException("Verification Code is Expired, please try again!");
            };


            //comapring verification code to somthing that users send.
            if(verificationCode !== dto.code){
                throw new BadRequestException("Code Invalid!");
            };


            //deleting the key of the verification code in redis
            await this.verificationCode.delete(dto.email);

            

            //update user to set that veriyed.
            const newUser = await this.userRepo.update(
                {
                    email : dto.email,
                    isVerified : true
                }
            );

            //generating a new token for the user that's trying to verify it self.
            const token = await this.jwtRepo.generate({
                email : dto.email,
                username : newUser.username,
                isVerified : newUser.isVerified,
                id : newUser.id, 
            });

            return {
                message : "ok",
                token : token,
            }

        }
        catch(e : any){
            if (e instanceof BadRequestException || e instanceof NotFoundException) throw e;

            console.log(`Unexepted Error : ${e.message}`);
            throw new InternalServerErrorException("Internal Server Error!");
        }
    }
}