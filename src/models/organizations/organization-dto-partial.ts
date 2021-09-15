import { PartialType } from '@nestjs/mapped-types';
import { OrganizationDto } from './organization-dto';

export class OrganizationDtoPartial extends PartialType(OrganizationDto) { }