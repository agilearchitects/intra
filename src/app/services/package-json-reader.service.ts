interface IFsModule {
  readFileSync(path: string, encoding: BufferEncoding): string;
}

export class PackageJsonReaderService {
  public constructor(
    private readonly fsModule: IFsModule,
  ) { }

  public get(): any {
    return JSON.parse(this.fsModule.readFileSync("./package.json", "utf8"));
  }
}