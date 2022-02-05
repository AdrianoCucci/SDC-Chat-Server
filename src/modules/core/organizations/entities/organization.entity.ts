import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatMessage } from "../../chat-messages/entities/chat-message.entity";
import { Room } from "../../rooms/entities/room.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "Organizations" })
export class Organization {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public name: string;

  @Column({ nullable: true })
  public email?: string;

  @Column({ nullable: true })
  public phoneNumber?: string;

  @Column({ nullable: true })
  public street?: string;

  @Column({ nullable: true })
  public city?: string;

  @Column({ nullable: true })
  public province?: string;

  @Column({ nullable: true })
  public country?: string;

  @Column({ nullable: true })
  public postalCode?: string;


  @OneToMany(() => User, entity => entity.organization)
  public users?: User[];

  @OneToMany(() => Room, entity => entity.organization)
  public rooms?: Room[];

  @OneToMany(() => ChatMessage, entity => entity.organization)
  public chatMessages?: ChatMessage[];

  public constructor(values?: Partial<Organization>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}