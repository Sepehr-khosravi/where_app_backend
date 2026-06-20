export class User {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly email: string,
    public isVerified: boolean,
    public address?: string | null,
  ) {}

  verify(): void {
    this.isVerified = true;
  }
}