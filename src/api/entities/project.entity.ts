import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CustomerEntity } from "./customer.entity";
import { Entity as AppEntity } from "./entity";
import { ProjectUserEntity } from "./project-user.entity";
import { TaskEntity } from "./task.entity";

@Entity()
export class ProjectEntity extends AppEntity {
  @Column()
  public name!: string;

  @Column({ type: "decimal", nullable: true })
  public rate!: number;

  @Column({ type: "decimal", nullable: true })
  public priceBudget!: number;

  @Column({ type: "decimal", nullable: true })
  public hoursBudget!: number;

  @OneToMany((type: any) => TaskEntity, (task: TaskEntity) => task.project, { cascade: true })
  public tasks!: TaskEntity[];

  @ManyToOne((type: any) => CustomerEntity, (customer: CustomerEntity) => customer.projects)
  public customer!: CustomerEntity;

  @OneToMany((type: any) => ProjectUserEntity, (projectUser: ProjectUserEntity) => projectUser.project, { cascade: true })
  public projectUsers!: ProjectUserEntity[];


}
