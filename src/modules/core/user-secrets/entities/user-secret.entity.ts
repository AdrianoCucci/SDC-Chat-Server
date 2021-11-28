export class UserSecret {
  public id: number;
  public password: string;
  public salt: string;
  public userId: number;

  public constructor(values?: Partial<UserSecret>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}