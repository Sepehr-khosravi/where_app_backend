export interface IVerificationCodeRepository{
    set(email : string, code : string, ttlSecconds : number) : Promise<void>;
    get(email : string) : Promise<string | null>
    delete(email : string) : Promise<void>;
}