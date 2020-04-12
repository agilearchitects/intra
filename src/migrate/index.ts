import * as envServiceFactory from "../shared/factories/env-service.factory";
import { MigrateService } from "../shared/services/migrate.service";
import { ConnectionConfigs } from "../shared/typeorm";
import { _20200221_182652 } from "./migrations/20200221_182652";

const envService = envServiceFactory.create();

interface LambdaEvent {
  action: "up" | "down" | "show";
}
export const handler = async ({ action }: LambdaEvent) => {
  // Verify action
  if (action === undefined || (action !== "up" && action !== "down" && action !== "show")) {
    throw new Error(`Migration failed. Input error. Was expection { action: "up" | "down" | "show" }`);
  }

  // Create migration service
  const migrateService = new MigrateService({
    ...envService.get("ENV", "LOCAL") === "LOCAL" ?
      ConnectionConfigs.local : ConnectionConfigs.production(
        envService.get("MYSQL_HOST", ""),
        parseInt(envService.get("MYSQL_PORT", ""), 10),
        envService.get("MYSQL_USERNAME", ""),
        envService.get("MYSQL_PASSWORD", ""),
        envService.get("MYSQL_DATABASE", ""),
      ),
    migrations: [
      _20200221_182652
    ]
  });

  // Call migration service depending on action
  if (action === "up") { await migrateService.migrate(); }
  else if (action === "down") { await migrateService.rollback(); }
  else if (action === "show") { return await migrateService.show(); }
}