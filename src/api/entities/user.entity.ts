// Libs
import { IUserModel, UserModel } from "@agilearchitects/authenticaton";
import { HashtiService } from "@agilearchitects/hashti";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";

// Services
import {
    hashtiService as hashServiceInstance,
} from "../../bootstrap";

// Entites
import { GroupEntity } from "./group.entity";
import { TimeEntity } from "./time.entity";

export interface IAttemptResult { token: string; user: UserEntity; }

@Entity()
export class UserEntity extends AppEntity implements IUserModel {
    @Column()
    public email!: string;

    @Column()
    public password!: string;

    @Column({ type: Date, nullable: true })
    public activated!: Date | null;

    @Column({ type: Date, nullable: true })
    public banned!: Date | null;

    @ManyToMany((type: any) => GroupEntity, (group: GroupEntity) => group.users)
    public groups!: GroupEntity[];

    @OneToMany((type: any) => TimeEntity, (time: TimeEntity) => time.user)
    public times!: TimeEntity[];

    public constructor() { super(); }
}
