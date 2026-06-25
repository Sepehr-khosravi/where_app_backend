import {
    Injectable, 
    Inject,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";

import type { IUserRepository } from "src/domain/users/repository/user.repository.interface";

@Injectable()
export class GetSelfUserUseCase{
    constructor(
        @Inject("IUserRepository") private readonly userRepo : IUserRepository
    ){};

    async execute(userId : number){
        try{
            //getting user
            const user = await this.userRepo.findById(userId);
            if(!user){
                throw new NotFoundException("User Not Found!");
            };

            return {
                message : "ok",
                profile : user
            };
        }
        catch(e : any){
            if (e instanceof NotFoundException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        }
    }
}