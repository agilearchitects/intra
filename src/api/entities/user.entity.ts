import { HashtiService } from "@agilearchitects/hashti";
import { JWTService } from "@agilearchitects/jwt";
import { dpService } from "@agilearchitects/tdi";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { Entity as AppEntity } from "./entity";
import { GroupEntity } from "./group.entity";
import { TimeEntity } from "./time.entity";

export interface IAttemptResult { token: string; user: UserEntity; }

@Entity()
export class UserEntity extends AppEntity {
    public static attempt(email: string, password: string): Promise< { user: UserEntity, token: string }>;
    public static attempt(
        email: string,
        password: string,
        hashService: HashtiService = dpService.container("service.hashti"),
        jwtService: JWTService = dpService.container("service.jwt"),
    ): Promise< IAttemptResult> {
        return new Promise((resolve, reject) => {
            this.findOne({ email }, { select: ["id", "password"] }).then((user: UserEntity | undefined) => {
                if (user !== undefined && hashService.check(password, user.password)) {
                    resolve({
                        token: jwtService.sign({ userId: user.id }),
                        user,
                    });
                } else {
                    reject(new Error("Auth attempt failed"));
                }
            }).catch((error: any) => reject(error));
        });
    }

    public static check(token: string): Promise< UserEntity>;
    public static check(
        token: string,
        jwtService: JWTService = dpService.container("service.jwt"),
    ): Promise< UserEntity> {
        return new Promise((resolve, reject) => {
            const decodedToken = jwtService.decode(token).payload as { userId: string };
            if (decodedToken.userId) {
                this.findOne(parseInt(decodedToken.userId, 10)).then((user: UserEntity | undefined) => {
                    if (user !== undefined) { resolve(user); return; }
                    reject(new Error("Token invalid. User not found"));
                });
                return;
            }
            reject(new Error("Token invalid"));
        });
    }
    @Column()
    public email!: string;

    @Column({
        select: false,
        length: 40,
        // select: false,
        transformer: {
            from: (value: string): string => value,
            to: (
                value: string,
                hashService: HashtiService = dpService.container("service.hashti"),
            ): string => hashService.create(value),
        },
    })
    public password!: string;

    @ManyToMany((type: any) => GroupEntity, (group: GroupEntity) => group.users)
    public groups!: GroupEntity[];

    @OneToMany((type: any) => TimeEntity, (time: TimeEntity) => time.user)
    public times!: TimeEntity[];

    public constructor(
        private readonly jwtService: JWTService = dpService.container("service.jwt"),
    ) { super(); }
}
