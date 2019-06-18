import { Column, Entity } from "typeorm";
import { Entity as AppEntity } from "./entity";

@Entity()
export class ResourceEntity extends AppEntity {
  @Column({
    unique: true,
  })
  public filename!: string;
  // fwe
  @Column()
  public title!: string;
}
