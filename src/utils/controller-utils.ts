import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { EntityColumnNotFound } from "typeorm";

export const catchEntityColumnNotFound = async (action: () => any): Promise<any> => {
  try {
    return await action();
  }
  catch(error) {
    if(error instanceof EntityColumnNotFound) {
      throw new BadRequestException(error.message);
    }
    else {
      throw new InternalServerErrorException(error.message ?? "An unhandled error occurred");
    }
  }
}