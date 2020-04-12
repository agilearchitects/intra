import { Connection, ConnectionOptions, createConnection, Migration, MigrationExecutor } from "typeorm";

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
    const connection = await createConnection(this.connectionOptions);
    const result = await callback(connection);
    await connection.close();
    return result;
  }
}