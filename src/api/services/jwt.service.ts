import * as jsonwebtoken from "jsonwebtoken";
import { ServiceModule } from "simplyserveme";
import { configService } from "./config.service";

type jwtSignFunctionType = (payload: any, key: string, { expiresIn }: { expiresIn: string }) => string | void;
type jwtDecodeFunctionType = (token: string, key: string) => { payload: object, [key: string]: any } | string | void;

export class JWTService extends ServiceModule {
    constructor(
        private readonly expiresIn = "7 days",
        private readonly key = configService.get("TOKEN", "EBdVaKyseI"),
        private readonly jwtSignFunction: jwtSignFunctionType = jsonwebtoken.sign,
        private readonly jwtDecodeFunction: jwtDecodeFunctionType = jsonwebtoken.verify,
    ) {
        super();
    }

    public sign(payload: any, { key, expiresIn }: { key?: string, expiresIn?: string } = {}): string {
        const token = this.jwtSignFunction({ payload }, key || this.key, { expiresIn: expiresIn || this.expiresIn });
        if (typeof token !== "string") { throw new Error("Unable to sign"); }
        return token;
    }

    public decode(token: string, key?: string): object {
        try {
            const decodedToken = this.jwtDecodeFunction(token, key || this.key);
            if (typeof decodedToken !== "object") { throw new Error("Unable to decode"); }

            return decodedToken.payload;

        } catch (e) {
            throw new Error(e);
        }
    }

    public verify(token: string, key?: string): boolean {
        return !!this.decode(token, key);
    }
}

export const jwtService: JWTService = JWTService.getInstance<JWTService>();
