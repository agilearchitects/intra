import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { IAppState, apiIndex, apiCreate } from "./app.store";
import { ProjectDTO } from "../../../shared/dto/project.dto";
import { CreateProjectDTO } from "../../../shared/dto/create-project.dto";

export interface IProjectState { } // tslint:disable-line:no-empty-interface

export type projectIndexAction = () => Promise<ProjectDTO[]>;
export type projectCreateAction = (payload: CreateProjectDTO) => Promise<void>;

export const projectStore: Module<IProjectState, IAppState> = {
  namespaced: true,
  state: {
    // State
  } as IProjectState,
  actions: {
    create: ({ dispatch }, payload: CreateProjectDTO): Promise<void> => {
      return apiCreate("/project", payload.serialize(), dispatch, "project");
    }
  } as ActionTree<IProjectState, IAppState>,
  mutations: {
    setValue: (state, payload: string) => {
      // state.value = payload;
    },
  } as MutationTree<IProjectState>,
}