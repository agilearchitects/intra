import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { ClaimEntity } from "./claim.entity";
import { Entity as AppEntity } from "./entity";
import { UserEntity } from "./user.entity";

@Entity()
export class GroupEntity extends AppEntity {
  @Column({ unique: true })
  public name!: string;

  @ManyToMany((type: any) => UserEntity, (user: UserEntity) => user.groups)
  @JoinTable()
  public users?: UserEntity[];

  @ManyToMany((type: any) => ClaimEntity, (claim: ClaimEntity) => claim.groups)
  @JoinTable()
  public claims?: ClaimEntity[];
}
