import { Connection, ConnectionOptions, DefaultNamingStrategy, EntityManager, getConnectionManager, NamingStrategyInterface, } from "typeorm";
import { RelationIdLoader } from "typeorm/query-builder/RelationIdLoader";
import { RelationLoader } from "typeorm/query-builder/RelationLoader";

export class ConnectionManangerModule {
  public static async connect(options: ConnectionOptions): Promise<Connection> {
    const connectionManager = getConnectionManager()

    if (connectionManager.has('default')) {
      return this.injectConnectionOptions(connectionManager.get(), options)
    } else {
      return connectionManager.create(options).connect()
    }
  }
  private static injectConnectionOptions(connection: Connection, connectionOptions: ConnectionOptions) {
    /**
     * from Connection constructor()
     */

    ((connection as any).options as ConnectionOptions) = connectionOptions;
    ((connection as any).manager as EntityManager) = connection.createEntityManager();
    ((connection as any).namingStrategy as NamingStrategyInterface) = connection.options.namingStrategy || new DefaultNamingStrategy();
    ((connection as any).relationLoader as RelationLoader) = new RelationLoader(connection);
    ((connection as any).relationIdLoader as RelationIdLoader) = new RelationIdLoader(connection);

    /**
     * from Connection connect()
     */
    ((connection as any).buildMetadatas as () => void)();
    return connection;
  }
}