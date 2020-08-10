// Libs
import { Column, Entity, ManyToOne } from "typeorm";

// Base entity
import { Entity as AppEntity } from "./entity";

// Entities
import { ClaimEntity } from "./claim.entity";
import { RoleEntity } from "./role.entity";

@Entity()
export class TextEntity extends AppEntity {
  @Column({
    unique: true,
  })
  public name!: string;

  @Column({ type: "text" })
  public content!: string;

  @ManyToOne((type: any) => ClaimEntity, (claim: ClaimEntity) => claim.texts, { nullable: false })
  public claim!: null | ClaimEntity;

  @ManyToOne((type: any) => RoleEntity, (role: RoleEntity) => role.texts, { nullable: false })
  public role!: RoleEntity;
}
