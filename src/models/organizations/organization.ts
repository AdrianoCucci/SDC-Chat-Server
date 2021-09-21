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
      const fullAddress: string = this.createFullAddress();

      if(fullAddress) {
        this.fullAddress = fullAddress;
      }
    }
  }

  private createFullAddress(): string {
    let address: string = "";

    if(this.street) {
      address += `${this.street}, `;
    }
    if(this.city) {
      address += `${this.city}, `;
    }
    if(this.province) {
      address += `${this.province}, `;
    }
    if(this.country) {
      address += `${this.country} `;
    }
    if(this.postalCode) {
      address += `${this.postalCode}`;
    }

    //Remove any leading/trailing commas.
    const commaTrimExp: RegExp = /(^,+)|(,+$)/g

    return address
      .trim()
      .replace(commaTrimExp, '');
  }
}