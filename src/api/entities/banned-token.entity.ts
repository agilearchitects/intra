// Libs
import { IBannedTokenModel } from "@agilearchitects/authenticaton";
import { Column, Entity } from "typeorm";
import { Entity as AppEntity } from "./entity";

@Entity()
export class BannedTokenEntity extends AppEntity implements IBannedTokenModel {
  @Column()
  public token!: string;
}
