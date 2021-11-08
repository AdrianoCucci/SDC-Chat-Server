export class UserPassword {
  public id: number;
  public value: string;
  public salt: string;
  public userId: number;

  public constructor(values?: Partial<UserPassword>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}