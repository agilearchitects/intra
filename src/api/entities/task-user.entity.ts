import { Column, Entity, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { TaskEntity } from "./task.entity";

import { Entity as AppEntity } from "./entity";
import { UserEntity } from "./user.entity";

@Entity()
export class TaskUserEntity extends AppEntity {
  @Column()
  public rate!: number;

  @ManyToOne((type: any) => TaskEntity, (task: TaskEntity) => task.taskUsers)
  public task!: TaskEntity;

  @OneToOne((type: any) => UserEntity, (user: UserEntity) => user.taskUser)
  @JoinColumn()
  public user!: UserEntity;
}
