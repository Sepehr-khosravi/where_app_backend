import {
    Injectable,
    Inject,
    InternalServerErrorException,
    NotFoundException,

} from "@nestjs/common";

//repositories
import type { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";
//dto
import { CancelInviteDto } from "../dto/cancel-invite.dto";


@Injectable()
export class CancelInviteUseCase{
    constructor(
        @Inject("IRelationRepository") private readonly relationRepo : IRelationRepository
    ){};


    async execute(dto : CancelInviteDto, userId : number){
        try{
            //check existing
            const invite = await this.relationRepo.findSentInviteById(dto.inviteId, userId);
            if(!invite){
                throw new NotFoundException("Invite NotFound!");
            };

            //removing invite from data base
            await this.relationRepo.deleteInvite(dto.inviteId);

            return {
                message : "ok"
            };
        }catch(e : any){
            if (e instanceof NotFoundException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        }
    }
};