export type observer<T> = (payload?: T) => void;

export interface ISubscription {
  unsubscribe: () => void;
}

export class BroadcastService {
  private observers: { [key: string]: (observer<any>)[] } = {};

  /**
   * Subscribe to event handler
   * @param name Name of event
   * @param callback The callback to be called each time event emits
   */
  public subscribe<T>(name: string, callback: observer<T>): ISubscription {
    // Looks for named observer list. If not create it
    if (!(name in this.observers)) {
      this.observers[name] = [];
    }

    // Pushes callback to observer list
    this.observers[name].push(callback);

    return {
      // Return unsubscribe method
      unsubscribe: (): void => {
        // Find callback in observer list
        const index = this.observers[name].findIndex((observer: observer<T>) => observer === callback);
        // Removes it if found
        if (index !== -1) { this.observers[name].splice(index, 1) }
      }
    }
  }

  /**
   * Emit event
   * @param name Name of event
   * @param payload Payload to send
   */
  public emit<T = any>(name: string, payload?: T): void {
    // Look if observer with name exists
    if (name in this.observers) {
      // Call each observer callback in observer list with payload
      this.observers[name].forEach((observer: observer<T>) => observer(payload));
    }
  }
}
