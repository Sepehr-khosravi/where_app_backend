import {
    Injectable,
    Inject,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";

//repositories
import type { IUserRepository } from "src/domain/users/repository/user.repository.interface";

//dto
import { SearchUsersQueryDto } from "../dto/search.dto";


@Injectable()
export class SearchUsersUseCase{
    constructor(
        @Inject("IUserRepository") private readonly userRepo : IUserRepository
    ){};

    async execute(dto : SearchUsersQueryDto, userId : number){
        try{
            const users = await this.userRepo.searchUsers(userId, dto);
            if(!users.length){
                throw new NotFoundException();
            };

            return {
                message : "ok",
                users
            };
        }
        catch(e : any){
            if (e instanceof NotFoundException){
                throw e
            };
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        };
    };
}