import { BroadcastService } from "./broadcast.service";

export class StorageService {

  public private;
  private _storage: any = {};

  public constructor(
    private readonly key: string = "storage",
    private readonly broadcastService: BroadcastService,
  ) { }

  public on<T>(key: string, callback: (value: T) => void) {
    this.broadcastService.subscribe<T>(`storage.${key}`).then((payload: T) => callback(payload));
  }

  public get<T>(key: string, defaultValue?: T): T | undefined {
    // Read from storage
    this.read();
    // Look for key in storage and return it. Otherwise return default value
    if (key in this._storage) {
      return this._storage[key] as T;
    } else {
      return defaultValue;
    }
  }

  public set(key: string, value: any): void {
    // Set storage value
    this._storage[key] = value;
    // Call to write storage (save to local storage)
    this.write();
    // Emit event for key update
    this.broadcastService.emit(`storage.${key}`, value);
  }

  private write(): void {
    localStorage.setItem(this.key, JSON.stringify(this._storage));
  }
  private read(): void {
    const storage = JSON.parse(localStorage.getItem(this.key));
    if (storage !== null) {
      this._storage = JSON.parse(localStorage.getItem(this.key));
    }
  }
}
