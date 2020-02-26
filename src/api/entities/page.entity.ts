import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";

@Entity()
export class PageEntity extends AppEntity {
  @Column()
  public title!: string;

  @OneToMany((_: any) => PageEntity, (child: PageEntity) => child.parent)
  public children?: PageEntity[];

  @ManyToOne((_: any) => PageEntity, (parent: PageEntity) => parent.children)
  public parent?: PageEntity | null;

}
