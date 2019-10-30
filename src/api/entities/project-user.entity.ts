import { Column, Entity, ManyToOne } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { ProjectEntity } from "./project.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class ProjectUserEntity extends AppEntity {
  @Column({ type: "decimal", nullable: true })
  public rate!: number;

  @ManyToOne((type: any) => UserEntity, (user: UserEntity) => user.id, { cascade: true })
  public user!: UserEntity;

  @ManyToOne((type: any) => ProjectEntity, (project: ProjectEntity) => project.id)
  public project!: ProjectEntity;
}
