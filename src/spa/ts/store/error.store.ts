import { ActionTree, Dispatch, Module } from "vuex";

import { broadcast } from "../utils/broadcast";
import { IAppState } from "./app.store";

export interface IErrorPayload { code?: number; message?: string; error?: any; }
export type submitActionCallback = (payload: IErrorPayload) => Promise<void>;
export type subscribeActionPayload = (payload: IErrorPayload) => void;
export type subscribeActionCallback = (callback: subscribeActionPayload) => Promise<void>;

export interface IErrorState { } // tslint:disable-line:no-empty-interface

export const errorStore: Module<IErrorState, IAppState> = {
  namespaced: true,
  actions: {
    submit: ({ }, payload: IErrorPayload) => {
      broadcast.emit("error", payload);
    },
    subscribe: ({ }, callback: subscribeActionPayload) => {
      broadcast.subscribe("error").then((payload: IErrorPayload) => callback(payload));
    },
  } as ActionTree<IErrorState, IAppState>,
};

export const dispatchError = (dispatch: Dispatch, reject: (reason?: any) => void, message: IErrorPayload | string, error?: any): void => {
  const payload: IErrorPayload = typeof message === "string" ? { message, error } : message;
  dispatch("error/submit", payload, { root: true });
  reject();
};
