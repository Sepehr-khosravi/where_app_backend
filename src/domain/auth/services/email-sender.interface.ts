export interface IEmailSenderService {
    sendVerificationCode(email : string, code : string) : Promise<void>;
}