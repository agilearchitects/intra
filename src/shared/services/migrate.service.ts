import { Connection, ConnectionOptions, Migration, MigrationExecutor } from "typeorm";
import { ConnectionManangerModule } from "../modules/connection-manager.module";

export interface IMigration extends Migration {
  executed: boolean;
}

export class MigrateService {
  public constructor(
    private readonly connectionOptions: ConnectionOptions,
  ) { }

  public async migrate(): Promise<void> {
    await this.connect(async (connection: Connection): Promise<void> => {
      await connection.runMigrations({ transaction: "all" });
    });
  }

  public async rollback(): Promise<void> {
    await this.connect(async (connection: Connection): Promise<void> => {
      await connection.undoLastMigration({ transaction: "all" });
    });
  }

  public async show(): Promise<IMigration[]> {
    return await this.connect<IMigration[]>(async (connection: Connection): Promise<IMigration[]> => {
      const migrationExecutor = new MigrationExecutor(connection);
      const executedMigrations = await migrationExecutor.getExecutedMigrations();

      return (await migrationExecutor.getAllMigrations()).map((migration: Migration) => ({
        ...migration,
        executed: executedMigrations.findIndex((executedMigration: Migration) => executedMigration.name === migration.name) !== -1,
      }));
    });
  }

  protected async connect<T = void>(callback: (connection: Connection) => Promise<T>): Promise<T> {

    // Create connection
    const connection = await ConnectionManangerModule.connect(this.connectionOptions);
    try {
      // Execute callback with connection and return callback result
      const result = await callback(connection);
      return result;
    } catch (error) {
      throw error;
    } finally {
      // Make sure to always disconnect
      await connection.close();
    }
  }
}