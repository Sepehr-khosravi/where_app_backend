import {
    Injectable,
    Inject,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";

//repositories
import type { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";


@Injectable()
export class GetInvitesUseCase{
    constructor(
        @Inject("IRelationRepository") private readonly relationRepo : IRelationRepository
    ){};

    async execute(userId: number){
        try{
            //getting invites,
            const invites = await this.relationRepo.findReceivedInvites(userId);
            if(!invites.length){
                throw new NotFoundException()
            };

            return {
                message : "ok",
                selfId  : userId,
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