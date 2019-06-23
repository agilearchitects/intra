import { Column, Entity, OneToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { ProjectEntity } from "./project.entity";

@Entity()
export class CustomerEntity extends AppEntity {
  @Column()
  public name!: string;

  @OneToMany((type: any) => ProjectEntity, (project: ProjectEntity) => project.customer, { cascade: true })
  public projects!: ProjectEntity[];
}