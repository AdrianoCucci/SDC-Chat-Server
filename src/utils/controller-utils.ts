import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { EntityColumnNotFound } from "typeorm";

export const catchEntityColumnNotFound = async (action: () => any): Promise<void> => {
  try {
    await action();
  }
  catch(error) {
    if(error instanceof EntityColumnNotFound) {
      throw new BadRequestException(error.message);
    }
    else {
      throw new InternalServerErrorException(error);
    }
  }
}