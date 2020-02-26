import { runMigrations, undoMigration } from "./typeorm";

(async () => {
  if (process.argv.length > 2) {
    if (process.argv[2] === "migrate") {
      if (process.argv[3] === "up") {
        await runMigrations();
      } else if (process.argv[3] === "down") {
        await undoMigration();
      } else {
        // tslint:disable-next-line: no-console
        console.log(`Missing either "up" or "down" argument`);
      }
    } else {
      // tslint:disable-next-line: no-console
      console.log(`Argument "${process.argv[2]}" not recognized`);
    }
  } else {
    // tslint:disable-next-line: no-console
    console.log("No argument provided");
  }
})().then(() => process.exit());
