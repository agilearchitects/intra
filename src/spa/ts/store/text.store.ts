import { AxiosResponse, default as Axios } from "axios";
import { ActionTree, Module } from "vuex";

import { TextDTO, ITextJSON } from "../../../shared/dto/text.dto";
import { IAppState } from "./app.store";

export interface ITextState { } // tslint:disable-line:no-empty-interface

export type textIndexAction = () => Promise<TextDTO[]>;
export type textShowAction = (textName: string) => Promise<TextDTO>;
export type textUpdateAction = (text: TextDTO) => Promise<void>;

export const textStore: Module<ITextState, IAppState> = {
  namespaced: true,
  actions: {
    index: ({ dispatch }): Promise<TextDTO[]> => {
      return new Promise((resolve, reject) => {
        Axios.get<ITextJSON[]>("/text").then((response: AxiosResponse<ITextJSON[]>) => {
          resolve(response.data.map((text: ITextJSON) => TextDTO.parse({
            id: text.id,
            name: text.name,
            content: text.content,
          })));
        }).catch((error: any) => {
          dispatch("error/submit", { message: "text index request failed", error }, { root: true });
          resolve();
        });
      });
    },
    show: ({ dispatch }, textName: string): Promise<TextDTO> => {
      return new Promise((resolve, reject) => {
        Axios.get<ITextJSON>(`/text/${textName}`).then((response: AxiosResponse<ITextJSON>) => {
          resolve(TextDTO.parse({
            id: response.data.id,
            name: response.data.name,
            content: response.data.content,
          }));
        }).catch((error: any) => {
          dispatch("error/submit", { message: "text show request failed", error }, { root: true });
        });
      });
    },
    update: ({ dispatch }, text: TextDTO): Promise<void> => {
      return new Promise((resolve, reject) => {
        Axios.put(`/text/${text.id}`, text.serialize()).then(() => resolve()).catch((error: any) => {
          dispatch("error/submit", { message: "text update request failed", error }, { root: true });
          reject(error);
        });
      });
    },
  } as ActionTree<ITextState, IAppState>,
};
