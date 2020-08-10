import { EnvService } from "@agilearchitects/env";
import { TemplateService } from "@agilearchitects/templategenerator";

export const templateFactory = (envService: EnvService): TemplateService => {
  return new TemplateService(
    "./storage/email-templates/",
    {
      baseUrl: {
        api: envService.get("BASE_API_URL", "http://api.test.test:1234"),
        spa: envService.get("BASE_SPA_URL", "http://www.test.test:1234")
      }
    }
  )
}