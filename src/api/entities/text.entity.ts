import { Column, Entity } from "typeorm";
import { Entity as AppEntity } from "./entity";

@Entity()
export class TextEntity extends AppEntity {
  @Column({
    unique: true,
  })
  public name!: string;

  @Column()
  public content!: string;
}
