// Libs
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

// Base entity
import { Entity as AppEntity } from "./entity";

// Entities
import { TextEntity } from "./text.entity";

@Entity()
export class RoleEntity extends AppEntity {
  @Column({ unique: true })
  public name!: string;

  @OneToMany((type: any) => TextEntity, (text: TextEntity) => text.role)
  public texts?: TextEntity[];
}
