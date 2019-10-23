import { Column, Entity, ManyToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { TimeEntity } from "./time.entity";

@Entity()
export class TagEntity extends AppEntity {
  @Column()
  public name!: string;

  @ManyToMany((type: any) => TimeEntity, (time: TimeEntity) => time.tags)
  public times!: TimeEntity[];
}
