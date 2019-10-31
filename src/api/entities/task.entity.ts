import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ProjectEntity } from "./project.entity";
import { TaskUserEntity } from "./task-user.entity";
import { TimeEntity } from "./time.entity";

import { Entity as AppEntity } from "./entity";

@Entity()
export class TaskEntity extends AppEntity {
  @Column()
  public name!: string;

  @Column({ type: "decimal", nullable: true })
  public rate!: number | null;

  @Column({ type: "decimal", nullable: true })
  public priceBudget!: number | null;

  @Column({ type: "decimal", nullable: true })
  public hoursBudget!: number | null;

  @ManyToOne((type: any) => ProjectEntity, (project: ProjectEntity) => project.tasks)
  public project!: ProjectEntity;

  @OneToMany((type: any) => TimeEntity, (time: TimeEntity) => time.task)
  public times!: TimeEntity[];

  @OneToMany((type: any) => TaskUserEntity, (taskUser: TaskUserEntity) => taskUser.task, { cascade: true })
  public taskUsers!: TaskUserEntity[];
}
