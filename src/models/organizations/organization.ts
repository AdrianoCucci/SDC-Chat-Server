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
  public fullAddress?: string;

  public constructor(values?: Partial<Organization>) {
    if(values != null) {
      Object.assign(this, values);
    }

    if(!this.fullAddress) {
      this.fullAddress = this.createFullAddress();
    }
  }

  private createFullAddress(): string {
    let address: string = `${this.street}, ${this.city}, ${this.province}, ${this.country} ${this.postalCode}`.trim();
    const duplicateCommaExpr: RegExp = /,{2,}/g
    address = address.replace(duplicateCommaExpr, ',');

    //If address is nothing but a string of commas.
    if(/^,*$/.test(address)) {
      address = null;
    }

    return address;
  }
}