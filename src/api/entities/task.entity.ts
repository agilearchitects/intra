import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { ProjectEntity } from "./project.entity";

import { Entity as AppEntity } from "./entity";
import { TimeEntity } from "./time.entity";

@Entity()
export class TaskEntity extends AppEntity {
  @Column()
  public name!: string;

  @ManyToOne((type: any) => ProjectEntity, (project: ProjectEntity) => project.tasks)
  public project!: ProjectEntity;

  @OneToMany((type: any) => TimeEntity, (time: TimeEntity) => time.task)
  public times!: TimeEntity[];
}
