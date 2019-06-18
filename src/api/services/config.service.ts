// Libs
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import { ServiceModule } from "simplyserveme";

export class ConfigService extends ServiceModule {
  private vars: { [key: string]: string } = {};

  public constructor() {
    super();
    const configPath = path.resolve(".env");
    if (fs.existsSync(configPath)) {
      this.vars = dotenv.parse(fs.readFileSync(configPath));
    }
  }

  public get(name: string, defaultValue: string = ""): string {
    if (this.vars[name]) { return this.vars[name]; }

    return defaultValue;
  }
}

export const configService: ConfigService = ConfigService.getInstance<ConfigService>();
