import {
    Injectable,
    Inject,
    NotFoundException,
    InternalServerErrorException
} from "@nestjs/common";

//repositories
import type { IRelationRepository } from "src/domain/relations/repository/relation.repository.interface";
//dto
import { DeleteRelationDto } from "../dto/delete.dto";


@Injectable()
export class DeleteRelationUseCase{
    constructor(
        @Inject("IRelationRepository") private readonly relationRepo : IRelationRepository,
    ){};

    async execute(dto : DeleteRelationDto, userId : number){
        try{
            //check existing
            const relation = await this.relationRepo.findRelationByUserIdAndId(dto.id, userId);
            if(!relation){
                throw new NotFoundException("Relation Not Found!");
            };

            //removing 
            await this.relationRepo.deleteRelationship(dto.id);

            return {
                message : "ok"
            }

        }
        catch(e : any){
            if (e instanceof NotFoundException) throw e;
            console.log(`Unexcepted Error : ${e.message}`);
            throw new InternalServerErrorException();
        };
    }
}