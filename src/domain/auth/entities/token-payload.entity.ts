export class TokenPayload{
    constructor(
        public readonly id : number,
        public readonly email : string,
        public readonly username : string,
        public readonly error : boolean
    ){};
}