import { EnvService as BaseEnvService, IFsModule } from "@agilearchitects/env";

export class EnvService extends BaseEnvService {
  private readonly prefix: string;

  public constructor(
    prefix: string,
    path: string,
    fsModule: IFsModule,
  ) {
    super(path, fsModule);
    this.prefix = prefix !== "" ? `${prefix.toUpperCase()}_` : "";
  }

  public get(name: string, defaultValue: string) {
    return super.get(`${this.prefix}${name}`, defaultValue);
  }
}