// Modules
import { EjsModule } from "../modules/ejs.module";

// DTO's
import { IDictionaryDTO } from "../../shared/dto/dictionary.dto";
import { RandomModule } from "../modules/random.module";

interface IFsModule {
  readFileSync: (path: string, encoding: BufferEncoding) => string;
  readdirSync: (path: string) => string[];
}

export interface ITemplate {
  name: string;
  source: string;
  target: string;
}

interface IChangeCaseModule {
  paramCase(input: string): string;
}

export class CliTemplateService {
  private templates: ITemplate[];

  public constructor(
    templateBasePath: string,
    private readonly fsModule: IFsModule,
    private readonly ejsModule: EjsModule,
    private readonly changeCaseModule: IChangeCaseModule,
    private readonly randomModule: typeof RandomModule,
  ) {
    this.templates = fsModule.readdirSync(templateBasePath)
      .filter((file: string) => file.match(/\.ejs$/) !== null)
      .map((file: string) => {
        const match: RegExpMatchArray | null = file.match(/([^.]*)\..*\.ejs$/);
        if (match === null) { throw new Error(`Unable to parse file "${file}"`); }

        // Get name from template
        const name: string = match[1];

        // Get target value from first row in file
        const tagetMatch: RegExpMatchArray | null = fsModule.readFileSync(`${templateBasePath}/${file}`, "utf8")
          .split("/n")[0]
          .match(/target=(.+) -->/);

        if (tagetMatch === null) { throw new Error(`Unable to get target attribute from "${file}". Make sure first row of file contains "target=PATH"`); }

        return {
          name,
          source: `${templateBasePath}/${file}`,
          target: tagetMatch[1],
        } as ITemplate
      });
  }

  public generate(templateName: string, name: string, vars: IDictionaryDTO<any> = {}): void {
    const template: ITemplate | undefined = this.templates.find((template: ITemplate) => template.name === templateName);
    if (template === undefined) { throw new Error(`Unable to find template "${templateName}"`); }
    this.ejsModule.stringToFile(
      // Provide source file without first line (first line is template data)
      this.fsModule.readFileSync(template.source, "utf8").split("\n").slice(1).join("\n"),
      // Output is target combined with param case version of provided name and file extension
      this.ejsModule.stringToString(template.target, { name: this.changeCaseModule.paramCase(name) }),
      {
        changeCase: this.changeCaseModule,
        randomModule: this.randomModule,
        name,
        ...vars,
      });
  }
}