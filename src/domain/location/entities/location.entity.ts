export class Location {
  constructor(
    public readonly userId: number,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly updatedAt: Date,
  ) {}
}