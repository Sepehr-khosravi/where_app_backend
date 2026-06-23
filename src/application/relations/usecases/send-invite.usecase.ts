import {
    Injectable,
    Inject,
    ConflictException,
    InternalServerErrorException
} from "@nestjs/common";

//dto
import { SendInviteDto } from "../dto/send-invite.dto";

//repositories
import type { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";

@Injectable()
export class SendInviteUseCase{
    constructor(
        @Inject("IRelationRepository") private readonly relationRepo : IRelationRepository,
    ){};

    async execute(dto : SendInviteDto){
        try{
            //check existing
            const isInviteExist = await this.relationRepo.findExistingInvite(dto.senderId,dto.receiverId);
            if(isInviteExist){
                throw new ConflictException("You Have Already Sent An Invite Before!");
            };
            //creating a new invite:
            const invite = await this.relationRepo.createInvite(dto.senderId, dto.receiverId);
            
            //responsing
            return {
                message : "ok",
                invite
            } ;
        }
        catch(e : any){
            if(e instanceof ConflictException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        }
    };
}