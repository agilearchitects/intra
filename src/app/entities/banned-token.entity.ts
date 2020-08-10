// Libs
import { IBannedTokenEntity } from "@agilearchitects/authenticaton";
import { Column, Entity } from "typeorm";
import { Entity as AppEntity } from "./entity";

@Entity()
export class BannedTokenEntity extends AppEntity implements IBannedTokenEntity {
  @Column()
  public token!: string;
}
