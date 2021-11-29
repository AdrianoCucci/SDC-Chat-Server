import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "UserSecrets" })
export class UserSecret {
  @PrimaryGeneratedColumn({ type: "bigint" })
  public id: number;

  @Column()
  public password: string;

  @Column()
  public salt: string;

  @Column({ type: "bigint" })
  public userId: number;
  

  @OneToOne(() => User, entity => entity.userSecret)
  public user?: User;

  public constructor(values?: Partial<UserSecret>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}