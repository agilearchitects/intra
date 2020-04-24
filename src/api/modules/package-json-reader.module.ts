import * as fs from "fs";

interface IFsModule {
  readFileSync(path: string, encoding: string): string;
}

export class PackageJsonReaderModule {
  public constructor(
    private readonly fsModule: IFsModule = fs,
  ) { }
  public get(): any {
    return JSON.parse(this.fsModule.readFileSync("./package.json", "utf8"));
  }
}