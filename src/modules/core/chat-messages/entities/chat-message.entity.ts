import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Organization } from "../../organizations/entities/organization.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "ChatMessages" })
export class ChatMessage {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public contents: string;

  @Column({ type: "timestamp" })
  public datePosted: Date | string;

  @Column()
  public senderUserId: number;

  @Column()
  public organizationId?: number;


  @ManyToOne(() => User, entity => entity.chatMessages)
  public senderUser?: User;

  @ManyToOne(() => Organization, entity => entity.chatMessages)
  public organization?: Organization;

  public constructor(values?: Partial<ChatMessage>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}