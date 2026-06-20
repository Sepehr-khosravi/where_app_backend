/**
 * Location's view of "relations" — deliberately minimal.
 * Implemented by an adapter that calls into your existing relations module/repo.
 * This keeps the location feature decoupled from relations' internal models.
 */
export interface IRelationsLookup {
  /**
   * Returns user ids that have an ACCEPTED relation with the given user
   * (i.e. who is allowed to see this user's location).
   */
  getAcceptedRelationUserIds(userId: number): Promise<number[]>;
}