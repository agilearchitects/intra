// Libs
import { IMigration } from "@agilearchitects/typeorm-helper";
import * as fs from "fs";

// Factories
import { cliFactory } from "./factories/apps/cli.factory";

(async () => {
  // Get CLI with env-. migrate-, and template service service
  const { cli, envService, migrateService, templateService, randomModule, fsModule } = await cliFactory(process.env.ENV_PATH);

  cli.register("generate", async () => {
    if (cli.argumentList[0] === "template") {
      if (cli.argumentList[1] === undefined || cli.argumentList[2] === undefined) {
        cli.error("Template and/or template name is missing");
        return;
      }
      try {
        templateService.generate(cli.argumentList[1], cli.argumentList[2], cli.argumentDictionary);
        cli.success("Template generated!");
      } catch (error) {
        cli.error(`Genrating template failed with message: ${error.message}`)
      }
    } else if (cli.argumentList[0] === "keys") {
      const answer = await cli.prompt("Are you sure you want to update .env keys? ");
      if (["yes", "y"].indexOf(answer.toLowerCase()) === -1) { return; }

      const envFilePath = ".env";

      // Read env-file
      let envFile: string = fsModule.readFileSync(envFilePath, "utf8");

      // Generate random keys
      envFile = envFile.replace(/^(KEY)=.*$/m, `$1=${randomModule.string(10)}`);
      envFile = envFile.replace(/^(TOKEN)=.*$/m, `$1=${randomModule.string(42)}`);
      envFile = envFile.replace(/^(AUTH_KEY)=.*$/m, `$1=${randomModule.string(42)}`);
      envFile = envFile.replace(/^(REFRESH_KEY)=.*$/m, `$1=${randomModule.string(42)}`);
      envFile = envFile.replace(/^(ACTIVATION_KEY)=.*$/m, `$1=${randomModule.string(42)}`);
      envFile = envFile.replace(/^(RESET_KEY)=.*$/m, `$1=${randomModule.string(42)}`);

      // Write to env-file
      fsModule.writeFileSync(envFilePath, envFile, "utf8");

      cli.success("New keys for .env file generated");
    }
  }).register("migrate", async () => {
    const env = envService.get("ENV", "");
    if (env !== "local" && ["up", "down"].includes(cli.argumentList[0]) === true) {
      if (["y", "Y", "yes", "YES"].includes(await cli.prompt(`Are you sure you want to run this command in ${env}? `)) === false) {
        cli.error("Migration aborted");
        return;
      }
    }
    if (cli.argumentList[0] === "list") {
      // List migrations
      const migrations: IMigration[] = await migrateService.show();
      if (migrations.length === 0) {
        cli.print("No migration exists");
      } else {
        cli.table(migrations, ["name", "executed"]);
      }
    } else if (cli.argumentList[0] === "generate") {
      // Generate migrations
      await migrateService.generate(envService.get("MIGRATION_OUTPUT_PATH", ""));
    } else if (cli.argumentList[0] === "up") {
      if (env !== "local") {
        await cli.prompt("")
      }
      // Migrate
      await migrateService.migrate();
    } else if (cli.argumentList[0] === "down") {
      // Rollback
      await migrateService.rollback();
    } else {
      // No migrate argument could be parsed
      cli.error("Migrate argument was either missing or incorrect");
    }
  }).invoke();
})();