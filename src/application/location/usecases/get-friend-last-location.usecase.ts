import {
    BadRequestException,
    Inject,
    Injectable,
    InternalServerErrorException,
    NotFoundException
} from "@nestjs/common"

//repositories
import type { ILocationRepository } from "src/domain/location/repositories/location.repository.interface"

@Injectable()
export class GetFriendLastLocationUseCase{
    constructor(
        @Inject("ILocationRepository") private readonly locationRepo : ILocationRepository
    ){};


    async execute(friendId : number){
        try{
            //getting last location
            const lastLocation = await this.locationRepo.findByUserId(friendId);

            if(!lastLocation){
                throw new NotFoundException()
            };

            return lastLocation;
        }
        catch(e : any){
            if (e instanceof NotFoundException) throw e;
            console.log(`Unexcepted Error : ${e}`);
            throw new InternalServerErrorException();
        }
    }
}