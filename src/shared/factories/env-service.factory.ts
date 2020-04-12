import { EnvService } from "@agilearchitects/env";
import * as fs from "fs";

export const create = (fsModule?: typeof fs): EnvService => new EnvService(".env", false);
