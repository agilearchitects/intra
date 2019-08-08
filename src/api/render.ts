import * as changeCase from "change-case";
import * as ejs from "ejs";
import { writeFileSync } from "fs";
import { join, resolve } from "path";
import * as yargs from "yargs";
import { createConnection, Not } from "typeorm";

import { CustomerEntity } from "./entities/customer.entity";
import { ProjectEntity } from "./entities/project.entity";

const GENERATORS: { [key: string]: { templatePath: string, outputPath: string } } = {
  controller: {
    templatePath: "../../src/api/controllers/controller.ts.ejs",
    outputPath: "../../src/api/controllers/",
  },
  component: {
    templatePath: "../../src/spa/ts/components/component.vue.ejs",
    outputPath: "../../src/spa/ts/components/",
  },
  store: {
    templatePath: "../../src/spa/ts/store/store.ts.ejs",
    outputPath: "../../src/spa/ts/store/",
  },
  dto: {
    templatePath: "../../src/shared/dto/dto.ts.ejs",
    outputPath: "../../src/shared/dto/",
  }
};
// tslint:disable-next-line:no-unused-expression
yargs.command("generate <type> <name> [values...]", "Generate project file from tempalate",
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
        templatePath = resolve(__dirname, GENERATORS[key].templatePath);
        outputPath = resolve(__dirname, GENERATORS[key].outputPath);
      }
    });
    // Render from template
    ejs.renderFile(templatePath, { changeCase, name: args.name, values }, (err: Error, str?: string) => {
      if (err) { console.error(err); return; } // tslint:disable-line:no-console
      // Create new file
      const split = templatePath.split("/");
      const match = split[split.length - 1].match(/(.*)\.(.+)\.ejs$/);
      let fileNamePostfix = "";
      let fileExtension = "ts";
      if (match !== null) {
        fileNamePostfix = match[1];
        fileExtension = match[2];
      }
      writeFileSync(`${join(outputPath, changeCase.paramCase(args.name))}.${fileNamePostfix}.${fileExtension}`, str, "utf8");
    });
  }).command("create customer <name> [projects...]", "Create new customer with projects",
    (yargs: yargs.Argv) => {
      return yargs.positional("name", {
        describe: "Customer's name",
      }).positional("name", {
        describe: "What name should the new customer have?",
      });
    }, (args: any) => {
      createConnection().then(async (_) => {
        const customer = await CustomerEntity.findOne({ where: { name: args.name } });
        if (customer !== undefined) {
          // Get already existing projects for customer
          const existingProjects = await ProjectEntity.find(
            {
              where: args.projects.map((project: string) =>
                ({ customer: { id: customer.id }, name: project }))
            });

          // Add projects not already existing for customer (check name)
          customer.projects = await Promise.all((args.projects as string[])
            .filter((projectName: string) => existingProjects.findIndex((project: ProjectEntity) => project.name === projectName) === -1)
            .map((project: string) => ProjectEntity.create({ name: project, customer: customer }).save()));

          // Generate log message
          const projectNames = customer.projects.map((project: ProjectEntity) => project.name);
          if (projectNames.length > 0) {
            console.log(`${projectNames.length > 1 ? "Projects" : "Project"} "${projectNames.join(`", "`)}" ${projectNames.length > 1 ? "were" : "was"} added to customer "${customer.name}"`);
          } else {
            console.log(`No projects were added to customer "${customer.name}"`);
          }

        } else {
          // Create new customer
          const newCustomer = await CustomerEntity.create({ name: args.name }).save();
          newCustomer.projects = await Promise.all((args.projects as string[]).map(async (project: string) => await ProjectEntity.create({ name: project, customer: newCustomer }).save()));

          const projectNames = newCustomer.projects.map((project: ProjectEntity) => project.name);
          if (projectNames.length > 0) {
            console.log(`New customer "${newCustomer.name}" with ${projectNames.length > 1 ? "projects" : "project"} "${projectNames.join(`", "`)}" created`);
          } else {
            console.log(`Customer "${newCustomer.name}" created`);
          }
        }
      });
    }).demandCommand().argv;
