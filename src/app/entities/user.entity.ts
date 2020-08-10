// Libs
import { IUserEntity } from "@agilearchitects/authenticaton";
import { Column, Entity, FindConditions, IsNull, JoinTable, ManyToMany, ManyToOne, Not, OneToMany, OneToOne } from "typeorm";
import { Entity as AppEntity } from "./entity";

// Entites
import { ClaimEntity } from "./claim.entity";
import { GroupEntity } from "./group.entity";
import { TaskUserEntity } from "./task-user.entity";
import { TimeEntity } from "./time.entity";

export interface IAttemptResult { token: string; user: UserEntity; }

@Entity()
export class UserEntity extends AppEntity implements IUserEntity {
    public static activeWhere(): FindConditions<UserEntity> {
        return { activated: Not(IsNull()), banned: IsNull() };
    }

    @Column({ unique: true })
    public email!: string;

    @Column()
    public password!: string;

    @Column({ type: Date, nullable: true })
    public activated!: Date | null;

    @Column({ type: Date, nullable: true })
    public banned!: Date | null;

    @ManyToMany((type: any) => GroupEntity, (group: GroupEntity) => group.users)
    public groups?: GroupEntity[];

    @ManyToMany((type: any) => ClaimEntity, (claim: ClaimEntity) => claim.users)
    @JoinTable()
    public claims?: ClaimEntity[];

    @OneToMany((type: any) => TimeEntity, (time: TimeEntity) => time.user)
    public times?: TimeEntity[];

    @OneToMany((type: any) => TaskUserEntity, (taskUser: TaskUserEntity) => taskUser.user)
    public taskUsers?: TaskUserEntity[];

    public get isActivated(): boolean {
        return this.activated !== null;
    }
    public get isBanned(): boolean {
        return this.banned !== null;
    }
}
