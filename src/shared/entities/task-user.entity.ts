import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { TaskEntity } from "./task.entity";

import { Entity as AppEntity } from "./entity";
import { UserEntity } from "./user.entity";

@Entity()
export class TaskUserEntity extends AppEntity {
  @Column({ type: "decimal", nullable: true })
  public rate!: number | null;

  @ManyToOne((type: any) => TaskEntity, (task: TaskEntity) => task.taskUsers, { nullable: false })
  public task!: TaskEntity;

  @ManyToOne((type: any) => UserEntity, (user: UserEntity) => user.taskUsers, { nullable: false })
  public user!: UserEntity;
}
