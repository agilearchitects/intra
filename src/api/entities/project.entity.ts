import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CustomerEntity } from "./customer.entity";
import { Entity as AppEntity } from "./entity";
import { TaskEntity } from "./task.entity";
import { TimeEntity } from "./time.entity";
import { UserProjectEntity } from "./user-project.entity";

@Entity()
export class ProjectEntity extends AppEntity {
  @Column()
  public name!: string;

  @OneToMany((type: any) => TaskEntity, (task: TaskEntity) => task.project, { cascade: true })
  public tasks!: TaskEntity[];

  @ManyToOne((type: any) => CustomerEntity, (customer: CustomerEntity) => customer.projects)
  public customer!: CustomerEntity;

  @OneToMany((type: any) => UserProjectEntity, (userProject: UserProjectEntity) => userProject.project, { cascade: true })
  public userProjects!: UserProjectEntity[];
}
