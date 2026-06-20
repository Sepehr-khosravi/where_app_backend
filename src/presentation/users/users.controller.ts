import{
    Controller,
    Version,
    HttpCode,
    HttpStatus,
    Get,
    Query,
    UseGuards
} from "@nestjs/common";

//dto
import { GetUsersQueryDto } from "src/application/users/dto/get-all.dto";

//usecases
import { GetAllUsersUseCase } from "src/application/users/usecases/get-all-usecase";

//auth guard
import { AuthGuard } from "../guards/auth/auth.guard";




@UseGuards(AuthGuard)
@Controller("users")
export class UserController{
    constructor(
        private readonly getUsersUseCase : GetAllUsersUseCase,
    ){};

    
    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Get()
    async getUsers(@Query() queries : GetUsersQueryDto){
        return this.getUsersUseCase.execute(queries);
    }
};