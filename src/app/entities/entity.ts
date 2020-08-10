import moment, { Moment } from "moment";
import { BaseEntity, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export abstract class Entity extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;
  @CreateDateColumn({ type: "datetime", transformer: { to: (value?: Moment) => { return value !== undefined ? value.toDate() : undefined }, from: (value: Date) => { return moment(value); } } })
  public createdAt!: Moment;
  @UpdateDateColumn({ type: "datetime", transformer: { to: (value?: Moment) => { return value !== undefined ? value.toDate() : undefined }, from: (value: Date) => { return moment(value); } } })
  public updatedAt!: Moment;
}
