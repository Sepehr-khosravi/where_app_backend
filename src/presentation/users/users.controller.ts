import{
    Controller,
    Version,
    HttpCode,
    HttpStatus,
    Get,
    Post,
    Query,
    UseGuards,
    Body,
    Req
} from "@nestjs/common";

//dto
import { GetUsersQueryDto } from "src/application/users/dto/get-all.dto";
import { GetSelfUserUseCase } from "src/application/users/usecases/get-self-user.usecase";
import { SearchUsersQueryDto } from "src/application/users/dto/search.dto";

//usecases
import { GetAllUsersUseCase } from "src/application/users/usecases/get-all-usecase";


//auth guard
import { AuthGuard } from "../guards/auth/auth.guard";
import { SearchUsersUseCase } from "src/application/users/usecases/search.usecase";




@UseGuards(AuthGuard)
@Controller("users")
export class UserController{
    constructor(
        private readonly getUsersUseCase : GetAllUsersUseCase,
        private readonly searchUsersUseCase : SearchUsersUseCase,
        private readonly getSelfUserUseCase : GetSelfUserUseCase
    ){};

    
    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Get()
    async getUsers(@Query() queries : GetUsersQueryDto){
        return this.getUsersUseCase.execute(queries);
    }

    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Get("self")
    async getSelfUserProfile(@Req() req : any){
        return this.getSelfUserUseCase.execute(req.user.id);
    }

    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Post("search")
    async searchUsers(@Body() dto : SearchUsersQueryDto, @Req() req : any ){
        return this.searchUsersUseCase.execute(dto, req.user.id);
    };
    


};