// Libs
import { IUserModel, UserModel } from "@agilearchitects/authenticaton";
import { Column, Entity, FindConditions, IsNull, ManyToMany, ManyToOne, Not, OneToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";

// Entites
import { GroupEntity } from "./group.entity";
import { TimeEntity } from "./time.entity";
import { UserProjectEntity } from "./user-project.entity";

export interface IAttemptResult { token: string; user: UserEntity; }

@Entity()
export class UserEntity extends AppEntity implements IUserModel {
    public static activeWhere(): FindConditions<UserEntity> {
        return { activated: Not(IsNull()), banned: IsNull() };
    }

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

    @OneToMany((type: any) => UserProjectEntity, (userProject: UserProjectEntity) => userProject.user)
    public userProjects!: UserProjectEntity[];

    public constructor() { super(); }
}
