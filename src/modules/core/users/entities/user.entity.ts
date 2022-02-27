import { Role } from "src/models/auth/role";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChatMessage } from "../../chat-messages/entities/chat-message.entity";
import { Organization } from "../../organizations/entities/organization.entity";

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ enum: Role })
  public role: Role;

  @Column()
  public username: string;

  @Column({ nullable: true })
  public displayName?: string;

  @Column()
  public isLocked: boolean = false;

  @Column()
  public isOnline: boolean = false;

  @Column({ nullable: true })
  public organizationId?: number;

  @Column({ nullable: true })
  public preferencesJson?: string;


  @ManyToOne(() => Organization, entity => entity.users)
  @JoinColumn()
  public organization?: Organization;

  @OneToMany(() => ChatMessage, entity => entity.senderUser)
  public chatMessages?: ChatMessage[];

  public constructor(values?: Partial<User>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}