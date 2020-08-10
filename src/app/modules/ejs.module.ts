// DTO's
import { IDictionary } from "@agilearchitects/server/lib/modules/dictionary.module";
import { IDictionaryDTO } from "../../shared/dto/dictionary.dto";

export interface IEjsModule {
  render(template: string, data?: { [key: string]: any }): string;
}

export interface IFsModule {
  readFileSync: (path: string, encoding: BufferEncoding) => string;
  writeFileSync: (path: string, data: string, encoding: BufferEncoding) => void;
  mkdirSync: (path: string, options?: { recursive: true }) => any;
  existsSync: (path: string) => boolean;
}

export class EjsModule {
  public constructor(
    private readonly ejsModule: IEjsModule,
    private readonly fsModule: IFsModule,
    private readonly defaultVars: IDictionaryDTO<any> = {},
  ) { }

  public fileToFile(source: string, target: string, vars: IDictionaryDTO<any> = {}): void {
    // Make sure dir exists before creating file
    this.createDirRecursive(target);
    this.writeFile(
      target,
      this.ejsModule.render(
        this.readFile(source),
        { ...this.defaultVars, ...vars }
      ),
    );
  }
  public stringToFile(source: string, target: string, vars: IDictionaryDTO<any> = {}): void {
    // Make sure dir exists before creating file
    this.createDirRecursive(target);
    this.writeFile(
      target,
      this.ejsModule.render(
        source,
        { ...this.defaultVars, ...vars }
      ),
    );
  }

  public fileToString(source: string, vars: IDictionary<any> = {}): string {
    return this.ejsModule.render(
      this.readFile(source),
      { ...this.defaultVars, ...vars }
    );
  }

  public stringToString(source: string, vars: IDictionary<any> = {}): string {
    return this.ejsModule.render(source, { ...this.defaultVars, ...vars });
  }

  private createDirRecursive(path: string): void {
    const dir: string = path.replace(/[^\/]+$/, "");
    this.fsModule.mkdirSync(dir, { recursive: true });
  }

  private writeFile(path: string, content: string): void {
    if (this.fsModule.existsSync(path)) {
      throw new Error(`File "${path}" exists, will not overwrite`);
    }
    this.fsModule.writeFileSync(path, content, "utf8");
  }
  private readFile(path: string): string {
    return this.fsModule.readFileSync(path, "utf8");
  }
}