import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { UserEntity } from "./user.entity";

@Entity()
export class TokenEntity extends AppEntity {
  @Column()
  public token!: string;

  @Column({ type: String })
  public type!: "auth" | "refresh" | "password_reset";

  @Column()
  public expires!: Date;
}
