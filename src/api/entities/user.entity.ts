// Libs
import { IUserModel, UserModel } from "@agilearchitects/authenticaton";
import { Column, Entity, FindConditions, IsNull, ManyToMany, ManyToOne, Not, OneToMany, OneToOne } from "typeorm";
import { Entity as AppEntity } from "./entity";

// Entites
import { GroupEntity } from "./group.entity";
import { ProjectUserEntity } from "./project-user.entity";
import { TaskUserEntity } from "./task-user.entity";
import { TimeEntity } from "./time.entity";

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

    @OneToMany((type: any) => ProjectUserEntity, (projectUser: ProjectUserEntity) => projectUser.user)
    public projectUsers!: ProjectUserEntity[];

    @OneToMany((type: any) => TaskUserEntity, (taskUser: TaskUserEntity) => taskUser.user)
    public taskUser!: TaskUserEntity;

    public constructor() { super(); }
}
