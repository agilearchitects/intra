// Libs
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { IAppState, apiCreate, apiUpdate, apiDelete, apiShow, apiIndex } from "./app.store";

// DTO's
import { CreateTimeDTO } from "../../../shared/dto/create-time.dto";
import { UpdateTimeDTO } from "../../../shared/dto/update-time.dto";
import { TimeDTO } from "../../../shared/dto/time.dto";

export interface ITimeState { } // tslint:disable-line:no-empty-interface

export type timeIndexAction = () => Promise<TimeDTO[]>;
export type timeShowAction = (payload: number) => Promise<TimeDTO>;
export type timeCreateAction = (payload: CreateTimeDTO) => Promise<void>;
export type timeUpdateAction = (payload: UpdateTimeDTO) => Promise<void>;
export type timeDeleteAction = (payload: number) => Promise<void>;

export const timeStore: Module<ITimeState, IAppState> = {
  namespaced: true,
  state: {
    // State
  } as ITimeState,
  actions: {
    index: ({ dispatch }): Promise<TimeDTO[]> => {
      return apiIndex<TimeDTO>("/time", dispatch, "time");
    },
    show: ({ dispatch }, payload: number): Promise<TimeDTO> => {
      return apiShow<TimeDTO>(`/time/${payload}`, dispatch, "time");
    },
    create: ({ dispatch }, payload: CreateTimeDTO): Promise<void> => {
      return apiCreate("/time", payload.serialize, dispatch, "time");
    },
    update: ({ dispatch }, payload: UpdateTimeDTO): Promise<void> => {
      return apiUpdate(`/time/${payload.id}`, payload.serialize(), dispatch, "time");
    },
    delete: ({ dispatch }, payload: number): Promise<void> => {
      return apiDelete(`/time/${payload}`, dispatch, "time");
    },
  } as ActionTree<ITimeState, IAppState>
}