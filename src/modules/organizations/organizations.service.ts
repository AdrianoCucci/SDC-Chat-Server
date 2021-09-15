import { Injectable } from '@nestjs/common';
import { Organization } from 'src/models/organizations/organization';
import { ServiceBase } from 'src/utils/service-base';

@Injectable()
export class OrganizationsService extends ServiceBase<Organization> {
  constructor() {
    super("id",
      [
        {
          id: 1,
          name: "Sorriso Dental Care",
          email: "contact@sdc.ca",
          phoneNumber: "555-555-5555",
          street: "123 Test St.",
          city: "Toronto",
          province: "Ontario",
          country: "Canada",
          postalCode: "L7B 2G9"
        }
      ]
    );
  }
}