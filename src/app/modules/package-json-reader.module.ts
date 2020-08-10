import * as fs from "fs";

interface IFsModule {
  readFileSync(path: string, encoding: BufferEncoding): string;
}

export class PackageJsonReaderModule {
  public constructor(
    private readonly fsModule: IFsModule = fs,
  ) { }
  public get(): any {
    return JSON.parse(this.fsModule.readFileSync("./package.json", "utf8"));
  }
}