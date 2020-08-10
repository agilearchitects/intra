// Services
import { BroadcastService } from "./broadcast.service";

export interface IErrorPayload { code?: number; message?: string; error?: any; }
export type submitActionCallback = (payload: IErrorPayload) => Promise<void>;
export type subscribeActionPayload = (payload: IErrorPayload) => void;
export type subscribeActionCallback = (callback: subscribeActionPayload) => Promise<void>;

export class ErrorService {
  public constructor(
    private readonly broadcastService: BroadcastService,
  ) { }
  public submit(payload: IErrorPayload): void {
    this.broadcastService.emit("error", payload);
  }
  public subscribe(callback: subscribeActionPayload): void {
    this.broadcastService.subscribe("error", (payload?: IErrorPayload) => payload !== undefined ? callback(payload) : undefined);
  }
}
