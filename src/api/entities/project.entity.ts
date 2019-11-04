import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { CustomerEntity } from "./customer.entity";
import { Entity as AppEntity } from "./entity";
import { TaskEntity } from "./task.entity";

@Entity()
export class ProjectEntity extends AppEntity {
  @Column()
  public name!: string;

  @Column({ type: "decimal", nullable: true })
  public rate!: number | null;

  @Column({ type: "decimal", nullable: true })
  public priceBudget!: number | null;

  @Column({ type: "decimal", nullable: true })
  public hoursBudget!: number | null;

  @Column({ type: "date", nullable: true })
  public start!: Date | null;

  @Column({ type: "date", nullable: true })
  public end!: Date | null;

  @OneToMany((type: any) => TaskEntity, (task: TaskEntity) => task.project, { cascade: true, onDelete: "CASCADE" })
  public tasks!: TaskEntity[];

  @ManyToOne((type: any) => CustomerEntity, (customer: CustomerEntity) => customer.projects)
  public customer!: CustomerEntity;
}
