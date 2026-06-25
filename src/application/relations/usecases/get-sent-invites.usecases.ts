import {
    Injectable,
    Inject,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";

import type { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";

@Injectable()
export class GetSentInvitesUseCase{
    constructor(
        @Inject("IRelationRepository") private readonly relationRepo : IRelationRepository
    ){};


    async execute(userId : number){
        try{
            //getting invite
            const invites = await this.relationRepo.findSentInvites(userId);
            if(!invites.length){
                throw  new NotFoundException();
            };

            //responsing
            return {
                message : "ok",
                invites
            };
        }
        catch(e : any){
            if (e instanceof NotFoundException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        }
    }
}