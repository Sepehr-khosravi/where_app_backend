import {
    Injectable,
    Inject,
    InternalServerErrorException,
    NotFoundException,
} from "@nestjs/common";

//entity
import type { User } from "src/domain/users/entity/user";

//dependencies
import type { IUserRepository } from "src/domain/users/repository/user.repository.interface";

//dto
import { GetUsersQueryDto } from "../dto/get-all.dto";

@Injectable()
export class GetAllUsersUseCase{
    constructor(
        @Inject("IUserRepository") private readonly userRepo : IUserRepository,
    ){};

    async execute(dto : GetUsersQueryDto){
        try{
            //getting users
            const users : User[] | null = await this.userRepo.findAll(dto);

            //checking existing
            if(!users?.length || !users ){
                throw new NotFoundException();
            };

            return {
                message : "ok",
                users
            };

        }catch(e : any){
            if (e instanceof NotFoundException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        }
    }
}