import {
    Injectable,
    Inject,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";


//relations
import type { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";

//dto
import { RejectInviteDto } from "../dto/reject-invite.dto";

@Injectable()
export class RejectInviteUseCase{
    constructor(
        @Inject("IRelationRepository") private readonly realtionRepo : IRelationRepository
    ){};

    async execute(dto : RejectInviteDto, userId : number){
        try{
            //check existing 
            const invite = await this.realtionRepo.findReceivedInviteById(dto.inviteId, userId);
            if(!invite){
                throw new NotFoundException("Invite Not Found!");
            };

            //upadting invite status
            await this.realtionRepo.updateInviteStatus(dto.inviteId, "REJECTED");

            // //removing the invite from the db 
            // await this.realtionRepo.deleteInvite(dto.inviteId);

            //responsing
            return {
                message : "ok"
            };
        }
        catch(e : any){
            if(e instanceof NotFoundException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        }
    };
}