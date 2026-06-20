import {
    Injectable,
    Inject,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";

//repositories
import type { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";

@Injectable()
export class GetAllRelationsUseCase{
    constructor(
        @Inject("IRelationRepository") private readonly relationRepo : IRelationRepository
    ){};


    async execute(userId : number){
        try{
            //getting all relations
            const relations = await this.relationRepo.findAllRelations(userId);
            if(!relations.length || !relations){
                throw new NotFoundException();
            };

            return {
                message : "ok",
                selfId : userId,
                relations,
            };
        }
        catch(e : any){
            if (e instanceof NotFoundException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        }
    }
}