export type generator = { templatePath: string, outputPath: string };
interface IGenerators {
  controller: generator,
  component: generator,
  store: generator,
  dto: generator,
}

export const generatorModel: IGenerators = {
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