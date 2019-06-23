import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { IAppState, apiIndex } from "./app.store";
import { CustomerDTO } from "../../../shared/dto/customer.dto";

export interface ICustomerState { } // tslint:disable-line:no-empty-interface

export type customerIndexAction = () => Promise<CustomerDTO[]>;

export const customerStore: Module<ICustomerState, IAppState> = {
  namespaced: true,
  state: {
    // State
  } as ICustomerState,
  actions: {
    index: ({ dispatch }): Promise<CustomerDTO[]> => {
      return apiIndex<CustomerDTO>("/customer", dispatch, "customer");
    },
  } as ActionTree<ICustomerState, IAppState>,
  mutations: {
    setValue: (state, payload: string) => {
      // state.value = payload;
    },
  } as MutationTree<ICustomerState>,
}