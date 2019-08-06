// Libs
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { IAppState, apiCreate, apiUpdate, apiDelete, apiShow, apiIndex } from "./app.store";
import moment from "moment";

// DTO's
import { CreateTimeDTO } from "../../../shared/dto/create-time.dto";
import { UpdateTimeDTO } from "../../../shared/dto/update-time.dto";
import { TimeDTO } from "../../../shared/dto/time.dto";
import { StopTimeDTO } from "../../../shared/dto/stop-time.dto";

export interface ITimeState { } // tslint:disable-line:no-empty-interface

export type timeIndexAction = (payload?: { date?: Date, all?: boolean }) => Promise<TimeDTO[]>;
export type timeShowAction = (payload: number) => Promise<TimeDTO>;
export type timeCreateAction = (payload: CreateTimeDTO) => Promise<void>;
export type timeUpdateAction = (payload: UpdateTimeDTO) => Promise<void>;
export type timeDeleteAction = (payload: number) => Promise<void>;
export type timeStopAction = (payload: StopTimeDTO) => Promise<void>;

export const timeStore: Module<ITimeState, IAppState> = {
  namespaced: true,
  state: {
    // State
  } as ITimeState,
  actions: {
    index: ({ dispatch }, payload?: { date?: Date, year?: string, month?: string, week?: string, all?: boolean }): Promise<TimeDTO[]> => {
      const query: string[] = [];
      if (payload !== undefined) {
        if (payload.date !== undefined) {
          query.push(`date=${moment(payload.date).format("YYYY-MM-DD")}`);
        } else if (payload.year !== undefined) {
          query.push(`year=${moment(payload.date).format("YYYY")}`);
          if (payload.month !== undefined) {
            query.push(`month=${moment(payload.date).format("MM")}`);
          } else if (payload.week !== undefined) {
            query.push(`week=${moment(payload.date).format("w")}`);
          }
        }
        if (payload.all !== undefined && payload.all === true) {
          query.push("all=true");
        }
      }
      return apiIndex<TimeDTO>(`/time${query.length > 0 ? `?${query.join("&")}` : ""}`, dispatch, "time");
    },
    show: ({ dispatch }, payload: number): Promise<TimeDTO> => {
      return apiShow<TimeDTO>(`/time/${payload}`, dispatch, "time");
    },
    create: ({ dispatch }, payload: CreateTimeDTO): Promise<void> => {
      return apiCreate("/time", payload.serialize(), dispatch, "time");
    },
    update: ({ dispatch }, payload: UpdateTimeDTO): Promise<void> => {
      return apiUpdate(`/time/${payload.id}`, payload.serialize(), dispatch, "time");
    },
    delete: ({ dispatch }, payload: number): Promise<void> => {
      return apiDelete(`/time/${payload}`, dispatch, "time");
    },
    stop: ({ dispatch }, payload: StopTimeDTO): Promise<void> => {
      return apiUpdate(`/time/stop/${payload.id}`, payload.serialize(), dispatch, "time");
    }
  } as ActionTree<ITimeState, IAppState>
}