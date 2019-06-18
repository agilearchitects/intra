import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { UserEntity } from "./user.entity";

@Entity()
export class GroupEntity extends AppEntity {
  @Column()
  public name!: string;

  @ManyToMany((type: any) => UserEntity, (user: UserEntity) => user.groups)
  @JoinTable()
  public users!: UserEntity[];
}
