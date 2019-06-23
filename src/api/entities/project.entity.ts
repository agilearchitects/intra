import { Column, Entity, OneToMany, ManyToOne } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { TimeEntity } from "./time.entity";
import { CustomerEntity } from "./customer.entity";

@Entity()
export class ProjectEntity extends AppEntity {
  @Column()
  public name!: string;

  @OneToMany((type: any) => TimeEntity, (time: TimeEntity) => time.project)
  public times!: TimeEntity[];

  @ManyToOne((type: any) => CustomerEntity, (customer: CustomerEntity) => customer.projects)
  public customer!: CustomerEntity;
}