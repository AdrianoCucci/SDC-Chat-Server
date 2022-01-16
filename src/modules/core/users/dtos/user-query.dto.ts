import { IsOptional } from 'class-validator';
import { Includable } from 'src/models/includable';
import { PartialUserDto } from './partial-user.dto';

export class UserQueryDto extends PartialUserDto implements Includable {
  @IsOptional()
  public include?: string;
}