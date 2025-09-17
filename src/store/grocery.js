import axios from "../axios";

export default {
  namespaced: true,
  state: {
    groceryLists: [],
    currentList: [],
    loading: false,
    error: null
  },
  mutations: {
    SET_GROCERY_LISTS(state, lists) {
      state.groceryLists = lists;
    },
    SET_CURRENT_LIST(state, list) {
      state.currentList = list;
    },
    ADD_GROCERY_LIST(state, list) {
      state.groceryLists.unshift(list);
    },
    UPDATE_GROCERY_LIST(state, updatedList) {
      const index = state.groceryLists.findIndex(list => list.id === updatedList.id);
      if (index !== -1) {
        state.groceryLists.splice(index, 1, updatedList);
      }
      if (state.currentList?.id === updatedList.id) {
        state.currentList = updatedList;
      }
    },
    DELETE_GROCERY_LIST(state, listId) {
      state.groceryLists = state.groceryLists.filter(list => list.id !== listId);
      if (state.currentList?.id === listId) {
        state.currentList = null;
      }
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchGroceryLists({ commit, rootState }) {
      commit('SET_LOADING', true);
      try {
        const userId = rootState.user?.userId;
        if (!userId) {
          commit('SET_GROCERY_LISTS', []);
          return;
        }
        
        const response = await axios.get(`/groceryLists?userId=${userId}`);
        commit('SET_GROCERY_LISTS', response.data);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createGroceryList({ commit, rootState }, listData) {
      commit('SET_LOADING', true);
      try {
        const userId = rootState.user?.userId;
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const response = await axios.post('/groceryLists', {
          ...listData,
          userId,
          createdAt: new Date().toISOString(),
          items: []
        });
        commit('ADD_GROCERY_LIST', response.data);
        commit('SET_CURRENT_LIST', response.data);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateGroceryList({ commit }, { id, updates }) {
      commit('SET_LOADING', true);
      try {
        const response = await axios.patch(`/groceryLists/${id}`, updates);
        commit('UPDATE_GROCERY_LIST', response.data);
        commit('SET_ERROR', null);
        return response.data;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteGroceryList({ commit }, listId) {
      commit('SET_LOADING', true);
      try {
        await axios.delete(`/groceryLists/${listId}`);
        commit('DELETE_GROCERY_LIST', listId);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async addItemToList({ commit, state }, { listId, item }) {
      const list = state.groceryLists.find(l => l.id === listId) || state.currentList;
      if (!list) return;

      // Generate a more robust unique ID
      const maxId = list.items.reduce((max, item) => Math.max(max, item.id || 0), 0);
      const newId = maxId + 1;
      
      const updatedItems = [...list.items, { ...item, id: newId }];
      const updatedList = { ...list, items: updatedItems };
      
      commit('UPDATE_GROCERY_LIST', updatedList);
      
      try {
        const response = await axios.patch(`/groceryLists/${listId}`, { items: updatedItems });
        commit('UPDATE_GROCERY_LIST', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },

    async removeItemFromList({ commit, state }, { listId, itemId }) {
      const list = state.groceryLists.find(l => l.id === listId) || state.currentList;
      if (!list) return;

      const updatedItems = list.items.filter(item => item.id !== itemId);
      const updatedList = { ...list, items: updatedItems };
      
      commit('UPDATE_GROCERY_LIST', updatedList);
      
      try {
        const response = await axios.patch(`/groceryLists/${listId}`, { items: updatedItems });
        commit('UPDATE_GROCERY_LIST', response.data);
      } catch (error) {
        commit('SET_ERROR', error.message);
      }
    },

    setCurrentList({ commit }, list) {
      commit('SET_CURRENT_LIST', list);
    }
  },
  getters: {
    getListById: (state) => (id) => {
      return state.groceryLists.find(list => list.id === id);
    },
    sortedLists: (state) => {
      return [...state.groceryLists].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
    },
    hasLists: (state) => state.groceryLists.length > 0
  }
}
