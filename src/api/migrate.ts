import * as path from "path";
import { createConnection } from "typeorm";
import { defaultConnectionConfig } from "./typeorm";

(async () => {
  const connection = await createConnection({
    ...defaultConnectionConfig,
    migrations: [
      path.resolve(__dirname, "../migrations/*.js"),
    ],
    logging: process.argv[2].toLowerCase() === "status" ? false : "all",
  });
  if (process.argv[2].toLowerCase() === "status") {
    const hasPending: boolean = await connection.showMigrations();
    process.stdout.write(hasPending.toString());
  } else {
    await connection.runMigrations({ transaction: false });
  }
  await connection.close();
})();
