import {
    Controller,
    Get,    
    Post,
    Query,
    Body,
    HttpStatus,
    HttpCode,
    Version,
    UseGuards,
    Req,
    Delete
} from "@nestjs/common";

//usecases
import { AcceptInviteUseCase } from "src/application/relations/usecases/accept-invite.usecase";
import { CancelInviteUseCase } from "src/application/relations/usecases/cancel-invite.usecase";
import { DeleteRelationUseCase } from "src/application/relations/usecases/delete-relation.usecase";
import { GetAllRelationsUseCase } from "src/application/relations/usecases/get-all-relations.usecase";
import { GetInvitesUseCase } from "src/application/relations/usecases/get-invites.usecase";
import { GetSentInvitesUseCase } from "src/application/relations/usecases/get-sent-invites.usecases";
import { RejectInviteUseCase } from "src/application/relations/usecases/reject-invite.usecase";
import { SendInviteUseCase } from "src/application/relations/usecases/send-invite.usecase";

//dtos
import { AcceptInviteDto } from "src/application/relations/dto/accept-invite.dto";
import { CancelInviteDto } from "src/application/relations/dto/cancel-invite.dto";
import { DeleteRelationDto } from "src/application/relations/dto/delete.dto";
import { RejectInviteDto } from "src/application/relations/dto/reject-invite.dto";
import { SendInviteDto } from "src/application/relations/dto/send-invite.dto";

//guards
import { AuthGuard } from "../guards/auth/auth.guard";


@UseGuards(AuthGuard)
@Controller("relations")
export class RelationController{
    constructor(
        private readonly acceptInviteUseCase : AcceptInviteUseCase,
        private readonly cancelInviteuseCase : CancelInviteUseCase,
        private readonly deleteRelationUseCase : DeleteRelationUseCase,
        private readonly getAllRelationsUseCase : GetAllRelationsUseCase,
        private readonly getInvitesUseCase : GetInvitesUseCase,
        private readonly getSentInvitesUseCase : GetSentInvitesUseCase,
        private readonly rejectInviteUseCase : RejectInviteUseCase,
        private readonly sendInviteUseCase : SendInviteUseCase,
    ){};

    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Post("invites/accept")
    async accepInvite(@Body() dto : AcceptInviteDto){
        return this.acceptInviteUseCase.execute(dto);
    };

    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Post("invites/cancel")
    async cancelInvite(@Body() dto : CancelInviteDto, @Req() req : any){
        return this.cancelInviteuseCase.execute(dto, req.user.id);
    };

    @Version("1")
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete("delete")
    async deleteRelation(@Body() dto : DeleteRelationDto, @Req() req : any){
        return this.deleteRelationUseCase.execute(dto, req.user.id);
    };

    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Get()
    async getAllRelations(@Req() req : any){
        return this.getAllRelationsUseCase.execute(req.user.id);
    };

    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Get("invites")
    async getInvites(@Req() req : any){
        return this.getInvitesUseCase.execute(req.user.id);
    };

    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Get("invites/sent")
    async getSentInvites(@Req() req : any){
        return this.getSentInvitesUseCase.execute(req.user.id);
    }

    @Version("1")
    @HttpCode(HttpStatus.OK)
    @Post("invites/reject")
    async rejectInvite(@Body() dto : RejectInviteDto, @Req() req : any){
        return this.rejectInviteUseCase.execute(dto, req.user.id);
    };


    @Version("1")
    @HttpCode(HttpStatus.CREATED)
    @Post("invites/send")
    async sendInvite(@Body() dto : SendInviteDto){
        return this.sendInviteUseCase.execute(dto);
    };
};