export class Organization {
  public id: number;
  public name: string;
  public email?: string;
  public phoneNumber?: string;
  public street?: string;
  public city?: string;
  public province?: string;
  public country?: string;
  public postalCode?: string;

  public constructor(values?: Partial<Organization>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}