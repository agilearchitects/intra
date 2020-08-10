import { BroadcastService } from "./broadcast.service";

export class StorageService {
  private _storage: any = {};

  public constructor(
    private readonly key: string = "storage",
    private readonly broadcastService: BroadcastService,
  ) { }

  public on<T>(key: string, callback: (value: T) => void) {
    this.broadcastService.subscribe<T>(`storage.${key}`, (payload?: T) => payload !== undefined ? callback(payload) : undefined);
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

  public delete(key: string): void {
    if (key in this._storage) {
      // Delete if exists
      delete this._storage[key];
    }
    // Call to write storage (save to local storage)
    this.write();
    // Emit event for key update
    this.broadcastService.emit(`storage.${key}`, undefined);
  }

  private write(): void {
    localStorage.setItem(this.key, JSON.stringify(this._storage));
  }
  private read(): void {
    const storage = localStorage.getItem(this.key);
    if (storage !== null) {
      this._storage = JSON.parse(storage);
    }
  }
}
