import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "../../organizations/entities/organization.entity";
import { User } from "../../users/entities/user.entity";

@Entity({ name: "ChatMessages" })
export class ChatMessage {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: "4000" })
  public contents: string;

  @Column({ type: "datetime" })
  public datePosted: Date | string = new Date().toISOString();

  @Column()
  public senderUserId: number;

  @Column()
  public organizationId?: number;

  @ManyToOne(() => User, (entity) => entity.chatMessages, {
    onDelete: "CASCADE",
  })
  @JoinColumn()
  public senderUser?: User;

  @ManyToOne(() => Organization, (entity) => entity.chatMessages)
  @JoinColumn()
  public organization?: Organization;

  public constructor(values?: Partial<ChatMessage>) {
    if (values != null) {
      Object.assign(this, values);
    }
  }
}
