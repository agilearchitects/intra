import { ActionTree, GetterTree, Module, MutationTree } from "vuex";
import { IAppState, apiIndex, apiCreate } from "./app.store";
import { CustomerDTO } from "../../../shared/dto/customer.dto";
import { CreateCustomerDTO } from "../../../shared/dto/create-customer.dto";

export interface ICustomerState { } // tslint:disable-line:no-empty-interface

export type customerIndexAction = () => Promise<CustomerDTO[]>;
export type customerCreateAction = (payload: CreateCustomerDTO) => Promise<void>;

export const customerStore: Module<ICustomerState, IAppState> = {
  namespaced: true,
  state: {
    // State
  } as ICustomerState,
  actions: {
    index: ({ dispatch }): Promise<CustomerDTO[]> => {
      return apiIndex<CustomerDTO>("/customer", dispatch, "customer");
    },
    create: ({ dispatch }, payload: CreateCustomerDTO): Promise<void> => {
      return apiCreate("/customer", payload.serialize(), dispatch, "customer");
    }
  } as ActionTree<ICustomerState, IAppState>,
  mutations: {
    setValue: (state, payload: string) => {
      // state.value = payload;
    },
  } as MutationTree<ICustomerState>,
}