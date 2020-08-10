import { Interface } from "readline";

interface IReadlineModule {
  createInterface(input: NodeJS.ReadableStream, output?: NodeJS.WritableStream): Interface
}

export type commandCallback = (...args: string[]) => void;
export interface ICommand {
  name: string;
  callback: commandCallback;
}

export class CliService {
  private commands: ICommand[] = [];

  public constructor(
    private readonly readlineModule: IReadlineModule
  ) { }

  public register(commandName: string, callback: commandCallback): void {
    if (this.getCommand(commandName) === undefined) {
      throw new Error(`Command "${commandName}" is already registered`);
    }

    this.addCommand(commandName, callback);
  }

  public execute(commandName: string, ...args: string[]): void {
    const command: ICommand | undefined = this.getCommand(commandName);
    if (command === undefined) {
      throw new Error(`Command "${commandName}" could not be found`);
    }
    command.callback(...args);
  }

  public async prompt(question: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const rl = this.readlineModule.createInterface(
        process.stdin,
        process.stdout
      );
      rl.question(question, (answer: string) => resolve(answer));
    });
  }

  private getCommand(commandName: string): ICommand | undefined {
    return this.commands.find((command: ICommand) => command.name === commandName.toLowerCase());
  }
  private addCommand(commandName: string, callback: commandCallback): void {
    this.commands.push({ name: commandName.toLowerCase(), callback });
  }
}