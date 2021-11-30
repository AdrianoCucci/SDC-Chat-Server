import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organization } from "../../organizations/entities/organization.entity";

@Entity({ name: "Rooms" })
export class Room {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public number?: number;

  @Column({ nullable: true })
  public description?: string;

  @Column({ nullable: true })
  public pingSound?: number;

  @Column()
  public organizationId: number;


  @ManyToOne(() => Organization, entity => entity.rooms)
  public organization?: Organization;

  public constructor(values?: Partial<Room>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}