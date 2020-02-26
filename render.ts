// Libs
import * as changeCase from "change-case";
import * as ejs from "ejs";
import * as fs from "fs";
import { join } from "path";
import * as yargs from "yargs";

// Typeorm
import { generateMigrations, runMigrations, undoMigration } from "./src/api/typeorm";

const GENERATORS: { [key: string]: { templatePath: string, outputPath: string } } = {
  controller: {
    templatePath: "src/api/controllers/controller.ts.ejs",
    outputPath: "src/api/controllers/",
  },
  component: {
    templatePath: "src/spa/ts/components/component.vue.ejs",
    outputPath: "src/spa/ts/components/",
  },
  store: {
    templatePath: "src/spa/ts/store/store.ts.ejs",
    outputPath: "src/spa/ts/store/",
  },
  dto: {
    templatePath: "src/shared/dto/dto.ts.ejs",
    outputPath: "src/shared/dto/",
  },
};

const ENV_PATH = "./.env";
const ENV_EXAMPLE_PATH = "./.env.example";

const randomString = (length: number): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return new Array(length).fill("").map(() => chars[Math.floor(Math.random() * chars.length)]).join("");
};

// tslint:disable-next-line: no-unused-expression
yargs.command<{}>("generate <type> <name> [values...]", "Generate project file from tempalate",
  (yargs: yargs.Argv) => {
    return yargs.positional("type", {
      describe: "What template to render from",
    }).positional("name", {
      describe: "Under what name should the template be saved",
    });
  }, (args: any) => {
    const values: { [key: string]: string } = {};
    args.values.forEach((value: string, index: number) => {
      const parsedValue = value.split("=");
      if (parsedValue.length === 2) {
        values[parsedValue[0]] = parsedValue[1];
      } else {
        values[index] = value;
      }
    });
    let templatePath: string = "";
    let outputPath: string = "";
    Object.keys(GENERATORS).forEach((key: string) => {
      if (args.type === key) {
        templatePath = GENERATORS[key].templatePath;
        outputPath = GENERATORS[key].outputPath;
      }
    });
    // Render from template
    ejs.renderFile(templatePath, { changeCase, name: args.name, values }, (err: Error | null, str?: string) => {
      if (err !== null) { console.error(err); return; } // tslint:disable-line:no-console
      // Create new file
      const split = templatePath.split("/");
      const match = split[split.length - 1].match(/(.*)\.(.+)\.ejs$/);
      let fileNamePostfix = "";
      let fileExtension = "ts";
      if (match !== null) {
        fileNamePostfix = match[1];
        fileExtension = match[2];
      }
      fs.writeFileSync(`${join(outputPath, changeCase.paramCase(args.name))}.${fileNamePostfix}.${fileExtension}`, str, "utf8");
    });
  }).command<{}>("init", "Initiate .env file", (args: any) => {
    if (!fs.existsSync(ENV_PATH) && fs.existsSync(ENV_EXAMPLE_PATH)) {
      let configs: { [key: string]: string } = {};
      configs = fs.readFileSync(ENV_EXAMPLE_PATH, "utf8").split("\n").reduce((out, value) => {
        const split = value.split("=");
        out[split[0]] = split[1];
        return out;
      }, configs);
      configs.KEY = randomString(10);
      configs.TOKEN = randomString(40);

      fs.writeFileSync(ENV_PATH, Object.keys(configs).map((key: string) => `${key}=${configs[key]}`).join("\n"), "utf8");
    }
  }).command<{ command: "up" | "down" | "generate" }>("migrate <command>", "Migration command", (yargs: yargs.Argv) => {
    return yargs.positional("command", {
      describe: "",
      choices: ["up", "down", "generate"],
    });
  }, (args: { command: "up" | "down" | "generate" }) => {
    (async () => {
      if (args.command === "up") {
        await runMigrations();
      } else if (args.command === "down") {
        await undoMigration();
      } else {
        await generateMigrations();
      }
    })();
  })
  .demandCommand().argv;
