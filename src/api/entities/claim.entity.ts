import { IClaimModel } from "@agilearchitects/authenticaton";
import { Column, Entity, ManyToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { GroupEntity } from "./group.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class ClaimEntity extends AppEntity implements IClaimModel {
  @Column({ unique: true })
  public name!: string;
  @ManyToMany((type: any) => GroupEntity, (group: GroupEntity) => group.claims)
  public groups?: GroupEntity[];
  @ManyToMany((type: any) => UserEntity, (user: UserEntity) => user.claims)
  public users?: UserEntity[];
}
