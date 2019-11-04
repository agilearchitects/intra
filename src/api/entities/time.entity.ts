import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { TagEntity } from "./tag.entity";
import { TaskEntity } from "./task.entity";
import { UserEntity } from "./user.entity";

@Entity()
export class TimeEntity extends AppEntity {
  @Column()
  public from!: Date;

  @Column({ type: Date, nullable: true })
  public to!: Date | null;

  @Column({ type: String, nullable: true })
  public comment!: string | null;

  @ManyToOne((type: any) => UserEntity, (user: UserEntity) => user.times)
  public user!: UserEntity;

  @ManyToOne((type: any) => TaskEntity, (task: TaskEntity) => task.times)
  public task!: TaskEntity;

  @Column({ type: "decimal", nullable: true })
  public rate!: number | null;

  @ManyToMany((type: any) => TagEntity, (tag: TagEntity) => tag.times, { cascade: true })
  @JoinTable()
  public tags!: TagEntity[];
}
