import { Role } from "src/models/auth/role";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { ChatMessage } from "../../chat-messages/entities/chat-message.entity";
import { Organization } from "../../organizations/entities/organization.entity";
import { UserSecret } from "../../user-secrets/entities/user-secret.entity";

@Entity({ name: "Users" })
export class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: "enum", enum: Role })
  public role: Role = Role.User;

  @Column()
  public username: string;

  @Column({ nullable: true })
  public displayName?: string;

  @Column()
  public isLocked: boolean = false;

  @Column()
  public isOnline: boolean = false;

  @Column()
  public userSecretId: number;

  @Column({ type: "bigint", nullable: true })
  public organizationId?: number;


  @OneToOne(() => UserSecret, entity => entity.user)
  public userSecret?: UserSecret;

  @ManyToOne(() => Organization, entity => entity.users)
  public organization?: Organization;

  @OneToMany(() => ChatMessage, entity => entity.senderUserId)
  public chatMessages?: ChatMessage[];

  public constructor(values?: Partial<User>) {
    if(values != null) {
      Object.assign(this, values);
    }
  }
}