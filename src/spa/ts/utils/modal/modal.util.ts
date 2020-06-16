import Promise = require("bluebird");
import Vue from "vue";

import { i18n } from "../../locale";

import ModalComponent from "./modal.component.vue";
// global.Promise = Promise;

export enum modalSize {
  XS = "xs",
  SM = "sm",
  MD = "md",
  LG = "lg",
}
export interface IModalOptions {
  size?: modalSize;
  cancelOnEsc?: boolean;
  cancelOnOutsideClick?: boolean;
}

export enum modalEventType {
  BEFORE_OPEN = "beforeOpen",
  OPENED = "opened",
  BEFORE_CLOSE = "beforeClose",
  CLOSED = "closed",
  BEFORE_HIDE = "beforeHide",
  HIDDEN = "hidden",
}
export type modalEventCallback<T, R> = (component?: Vue, payload?: { data?: T, result?: R }) => void;
export type modalInterceptorCallback<T, R> = (component?: Vue, payload?: { data?: T, result?: R }) => Promise<void>;
export interface IModalEvent<T, R> {
  type: modalEventType;
  callback: modalEventCallback<T, R>;
}
export interface IModalInterceptor<T, R> {
  type: modalEventType;
  callback: modalInterceptorCallback<T, R>;
}

export class ModalInstance<T, R> {
  public static create<T = any, R = any>(component: typeof Vue, data?: T): ModalInstance<T, R> {
    return new ModalInstance<T, R>(Vue, component, data);
  }

  public events: IModalEvent<T, R>[] = [];
  public interceptors: IModalInterceptor<T, R>[] = [];
  private modalComponent: ModalComponent;
  private eventInActions: boolean = false;

  private constructor(vue: typeof Vue, component: typeof Vue, data?: T) {
    this.modalComponent = new (vue.extend(ModalComponent))({
      props: {
        data,
        component,
      },
      el: document.createElement("div"),
      i18n,
    });

    // Attach component to modal component
    this.modalComponent.$props.component = component;

    if (data !== undefined) {
      this.modalComponent.$props.data = data;
    }

    // Add listners for component events
    const callTriggerEvents = (type: "open" | "close" | "hide") => (payload?: { data?: T, result?: R }) => {
      this.triggerEvents({
        type, ...(payload !== undefined ? { data: payload.data, result: payload.result } : undefined), callback: () => {
          switch (type) {
            case "open":
              (this.modalComponent as any).open();
              break;
            case "close":
              (this.modalComponent as any).close();
              break;
            case "hide":
              (this.modalComponent as any).hide();
          }
        },
      });
    };
    this.modalComponent.$on("open", callTriggerEvents("open"));
    this.modalComponent.$on("close", callTriggerEvents("close"));
    this.modalComponent.$on("hide", callTriggerEvents("hide"));
  }

  public open(before?: modalInterceptorCallback<T, R>): Promise<R> {
    return new Promise((resolve, reject) => {
      // If before event is provided register it
      if (before !== undefined) { this.on(modalEventType.BEFORE_OPEN, before); }

      // Register listner to when modal closes
      this.on(modalEventType.CLOSED, (component: Vue, payload: { result: R }) => resolve(payload.result));
      this.modalComponent.$emit("open");
    });
  }

  public close(): Promise<R> {
    return new Promise((resolve, reject) => {
      this.on(modalEventType.CLOSED, () => resolve());
      this.modalComponent.$emit("close");
    });
  }

  public hide(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.on(modalEventType.HIDDEN, () => resolve());
      this.modalComponent.$emit("hide");
    });
  }

  public on(type: modalEventType | modalEventType[], callback: modalEventCallback<T, R>): this {
    if (!(type instanceof Array)) { type = [type]; }
    type.forEach((type: modalEventType) => this.events.push({ type, callback }));
    return this;
  }
  public intercept(type: modalEventType | modalEventType[], callback: modalInterceptorCallback<T, R>): this {
    if (!(type instanceof Array)) { type = [type]; }
    type.forEach((type: modalEventType) => this.interceptors.push({ type, callback }));
    return this;
  }

  public options(options: IModalOptions): this {
    if (options.size !== undefined) { this.modalComponent.$props.size = options.size; }
    if (options.cancelOnEsc !== undefined) { this.modalComponent.$props.cancelOnEsc = options.cancelOnEsc; }
    if (options.cancelOnOutsideClick !== undefined) { this.modalComponent.$props.cancelOnOutsideClick = options.cancelOnOutsideClick; }
    return this;
  }

  private triggerEvents({ type, data, result, callback }: { type: "open" | "close" | "hide", data?: T, result?: R, callback?: () => void }): void {
    if (this.eventInActions) { return; }
    this.eventInActions = true;
    const beforeType: modalEventType = type === "open" ? modalEventType.BEFORE_OPEN : type === "close" ? modalEventType.BEFORE_CLOSE : modalEventType.BEFORE_HIDE;
    const afterType: modalEventType = type === "open" ? modalEventType.OPENED : type === "close" ? modalEventType.CLOSED : modalEventType.HIDDEN;

    // Call all registered events to execute before
    this.events.filter((event: IModalEvent<T, R>) => event.type === beforeType).forEach((event: IModalEvent<T, R>) => event.callback(this.modalComponent.$props.component, { data, result }));

    // Call all register interceptors to be executed before and then resolve
    Promise.all(
      this.interceptors
        .filter((interceptor: IModalInterceptor<T, R>) => interceptor.type === beforeType)
        .map((interceptor: IModalInterceptor<T, R>) => new Promise((resolve, reject) =>
          interceptor.callback(this.modalComponent.$props.component, { data, result })
            .then(() => resolve())
            .catch((error: any) => reject(error)))),
    ).finally(() => {
      if (callback !== undefined) {
        callback();
        this.eventInActions = false;
      }
      // Call all registered events to execute after
      this.events.filter((event: IModalEvent<T, R>) => event.type === afterType).forEach((event: IModalEvent<T, R>) => event.callback(this.modalComponent.$props.component, { data, result }));

      // Call all register interceptors to be executed after
      Promise.all(
        this.interceptors
          .filter((interceptor: IModalInterceptor<T, R>) => interceptor.type === afterType)
          .map((interceptor: IModalInterceptor<T, R>) => new Promise((resolve, reject) =>
            interceptor.callback(this.modalComponent.$props.component, { data, result })
              .then(() => resolve())
              .catch((error: any) => reject(error)))),
      );
    });
  }
}
