import { Connection, ConnectionOptions, getConnectionManager } from "typeorm";

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

    // @ts-ignore
    connection.options = connectionOptions
    // @ts-ignore
    connection.manager = connection.createEntityManager();
    // @ts-ignore
    connection.namingStrategy = connection.options.namingStrategy || new DefaultNamingStrategy();
    // @ts-ignore
    connection.relationLoader = new RelationLoader(connection);
    // @ts-ignore
    connection.relationIdLoader = new RelationIdLoader(connection);

    /**
     * from Connection connect()
     */
    // @ts-ignore
    connection.buildMetadatas();

    return connection;
  }
}