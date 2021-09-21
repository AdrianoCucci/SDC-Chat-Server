import { Injectable } from '@nestjs/common';
import { Organization } from 'src/models/organizations/organization';
import { ServiceBase } from 'src/utils/service-base';

@Injectable()
export class OrganizationsService extends ServiceBase<Organization> {
  constructor() {
    super("id",
      [
        new Organization({
          id: 1,
          name: "Sorriso Dental Care",
          email: "contact@sdc.ca",
          phoneNumber: "555-555-5555",
          street: "123 Test St.",
          city: "Toronto",
          province: "Ontario",
          country: "Canada",
          postalCode: "L7B 2G9"
        }),
        new Organization({
          id: 2,
          name: "Demo Organization",
          email: "contact@demo.ca",
          phoneNumber: "123-456-7890",
          street: "456 Test Ave.",
          city: "Brampton",
          province: "Ontario",
          country: "Canada",
          postalCode: "L4C 1F6"
        })
      ]
    );
  }
}