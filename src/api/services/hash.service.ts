import * as bcrypt from "bcrypt";
import * as crypto from "crypto";

import * as fs from "fs";
import { ServiceModule } from "simplyserveme";

type bcryptHashSyncFunctionType = (data: any, saltOrRounds: string | number) => string;
type bcryptCompareSyncFunctionType = (data: any, encrypted: string) => boolean;

export class HashService extends ServiceModule {
    public constructor(
        private readonly bcryptHashSyncFunction: bcryptHashSyncFunctionType = bcrypt.hashSync,
        private readonly bcryptCompareSyncFunction: bcryptCompareSyncFunctionType = bcrypt.compareSync,
    ) {
        super();
    }

    public create(plainText: string): string {
        return this.bcryptHashSyncFunction(plainText, 10);
    }
    public check(plainText: string, hashString: string): boolean {
        return this.bcryptCompareSyncFunction(plainText, hashString);
    }
    public file(path: string): string {
        return crypto.createHash("md5").update(fs.readFileSync(path).toString()).digest("hex");
    }
}

export const hashService: HashService = HashService.getInstance<HashService>();
