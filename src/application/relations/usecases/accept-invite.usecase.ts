import {
    Injectable,
    Inject,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException
} from "@nestjs/common";
import { AcceptInviteDto } from "../dto/accept-invite.dto";

//repositories
import type { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";

@Injectable()
export class AcceptInviteUseCase{
    constructor(
        @Inject("IRelationRepository") private readonly relationRepo : IRelationRepository,
    ){};

    async execute(dto : AcceptInviteDto ){
        try{
            //check existing of the invite.
            const invite = await this.relationRepo.findInviteById(dto.inviteId);
            if(!invite){
                throw new NotFoundException("Invite Not Found!")
            }else if(!invite.isPending()){
                throw new BadRequestException("Invalid invite");
            };

            //updating the status of realtionship invite.
            await this.relationRepo.updateInviteStatus(dto.inviteId, "ACCEPTED");


            //creating a relationship
            const relationship = await this.relationRepo.createRelationship(invite.senderId, invite.receiverId);
            

            return {
                message : "ok",
                realtionId : relationship.id
            };
        }
        catch(e : any){
            if(e instanceof NotFoundException || e instanceof BadRequestException) throw e;

            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        }
    };
}