export type observer<T> = (payload: T) => void;

export class BroadcastService {
  private observers: { [key: string]: Array<observer<any>> | null } = {};

  public subscribe<T>(name: string) {
    let index: number;
    if (Object.keys(this.observers).findIndex((observerName: string) => observerName === name) !== -1) {
      index = this.observers[name].length;
      this.observers[name].push(null);
    } else {
      index = 0;
      this.observers[name] = [null];
    }
    const unsubscribe = () => {
      this.observers[name].splice(index, 1);
    };

    return {
      then: (callback: observer<T>) => {
        this.observers[name][index] = callback;
        return { unsubscribe };
      }, unsubscribe,
    };
  }
  public emit<T = any>(name: string, payload?: T) {
    if (this.observers[name]) {
      this.observers[name].forEach((observer: observer<T>) => {
        observer(payload);
      });
    }
  }
}
