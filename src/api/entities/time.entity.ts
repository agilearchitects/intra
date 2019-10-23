import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { ProjectEntity } from "./project.entity";
import { TagEntity } from "./tag.entity";
import { UserEntity } from "./user.entity";

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

  @ManyToMany((type: any) => TagEntity, (tag: TagEntity) => tag.times, { cascade: true })
  @JoinTable()
  public tags!: TagEntity[];
}
