// Libs
import { expect } from "chai";
import { describe, it } from "mocha";
import { BroadcastService } from "./broadcast.service";

describe("BroadcastService", () => {
  it("Should be able to subscribe", () => {
    const broadcastService = new BroadcastService();

    broadcastService.subscribe("my", () => { /* */ });
  });

  it("Should be able to emit subscribtion", () => {
    const expectedPayload: string = "Hello World";

    const broadcastService = new BroadcastService();

    broadcastService.subscribe<string>("my", (payload?: string) => {
      expect(payload).equal(expectedPayload);
    });
    broadcastService.emit("my", expectedPayload);
  });

  it("Should be able to unsubscribe", () => {
    const broadcastService = new BroadcastService();

    const subscription = broadcastService.subscribe<string>("my", () => {
      /* Error will never be thrown since the callback is unsubscribed
      before emitted */
      throw new Error();
    });
    subscription.unsubscribe();
    broadcastService.emit("my");
  });

  it("Should be able to have multiple subscriptions", (done) => {
    let counter: number = 0;
    const broadcastService = new BroadcastService();
    broadcastService.subscribe<string>("my", () => {
      counter++;
    });
    broadcastService.subscribe<string>("my", () => {
      counter++;
    });
    broadcastService.emit("my");

    setTimeout(() => {
      expect(counter).equal(2);
      done();
    }, 1);
  });
});