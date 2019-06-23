import { Column, Entity, ManyToOne } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { UserEntity } from "./user.entity";
import { ProjectEntity } from "./project.entity";

@Entity()
export class TimeEntity extends AppEntity {
  @Column()
  public from!: Date;

  @Column({ type: Date, nullable: true })
  public to!: Date | null;

  @Column({ nullable: true })
  public comment!: string;

  @ManyToOne((type: any) => UserEntity, (user: UserEntity) => user.times)
  public user!: UserEntity;

  @ManyToOne((type: any) => ProjectEntity, (project: ProjectEntity) => project.times)
  public project!: ProjectEntity;

  @Column({ nullable: true })
  public projectId!: number;
}
