import { 
    Controller,
    Post,
    Get,
    Body, 
    Query,
    HttpCode,
    Version,
    HttpStatus,
    UseGuards,
    Req,
} from "@nestjs/common";

//for making rate limitation
import { Throttle } from "@nestjs/throttler";

//dtos
import { RegisterDto } from "src/application/auth/dto/register.dto";
import { LoginDto } from "src/application/auth/dto/login.dto";
import { VerificationDto } from "src/application/auth/dto/verification.dto";
import { ResendVerificationCodeDto } from "src/application/auth/dto/resend.dto";

//usecase
import { RegisterUseCase } from "src/application/auth/usecases/register.usecase";
import { LoginUseCase } from "src/application/auth/usecases/login.usecase";
import { ResendVerificationCodeUseCase } from "src/application/auth/usecases/resend.usecase";
import { VerifyUseCase } from "src/application/auth/usecases/verify.usecase";

//authGuard
import { AuthGuard } from "../guards/auth/auth.guard";


@Controller("auth")
export class AuthController{
    constructor(
        private readonly registerUseCase : RegisterUseCase,
        private readonly loginUseCase : LoginUseCase,
        private readonly resendCodeUseCase : ResendVerificationCodeUseCase,
        private readonly verifyCode : VerifyUseCase,
    ){};

    @Version("1")
    @Throttle({
        default : { limit : 3, ttl : 300000}
    })
    // @Throttle()
    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() dto : RegisterDto){
        return this.registerUseCase.execute(dto);
    }


    @Version("1")
    @Throttle({
        default : {
            limit : 3,
            ttl : 60000
        }
    })
    @Post("verify-email")
    @HttpCode(HttpStatus.OK)
    async emailOtp(@Body() dto : VerificationDto){
        return this.verifyCode.execute(dto);
    }


    @Version("1")
    @Throttle({
        default : {
            limit : 3,
            ttl : 30000
        }
    })
    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(@Body() dto : LoginDto){
        return this.loginUseCase.execute(dto);
    }


    @Version("1")
    @Throttle({
        default  : {
            limit : 1,
            ttl : 300000
        }
    })
    @Post("resend-code")
    @HttpCode(HttpStatus.OK)
    async resendCode(@Body() dto : ResendVerificationCodeDto){
        return this.resendCodeUseCase.exectue(dto);
    }


    @UseGuards(AuthGuard)
    @Version("1")
    @Get("/check")
    @Throttle({
        default : {
            limit : 20,
            ttl : 60000
        }
    })
    @HttpCode(HttpStatus.OK)
    async checkToken(@Req() req : any){
        return {
            message : "ok",
            selfId : req.user.id
        };
    }




    
}