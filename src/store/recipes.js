import axios from "axios";

export default {
  namespaced: true,
  state: {
    recipes: [],
    searchResults: [],
    currentRecipe: null,
    favorites: [],
    categories: [],
    loading: false,
    error: null,
  },
  mutations: {
    SET_RECIPES(state, recipes) {
      state.recipes = recipes;
    },
    SET_SEARCH_RESULTS(state, results) {
      state.searchResults = results;
    },
    SET_CURRENT_RECIPE(state, recipe) {
      state.currentRecipe = recipe;
    },
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    SET_LOADING(state, status) {
      state.loading = status;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    ADD_TO_FAVORITES(state, recipe) {
      if (!state.favorites.find(fav => fav.idMeal === recipe.idMeal)) {
        state.favorites.push(recipe);
        localStorage.setItem('favorites', JSON.stringify(state.favorites));
      }
    },
    REMOVE_FROM_FAVORITES(state, recipeId) {
      state.favorites = state.favorites.filter(recipe => recipe.idMeal !== recipeId);
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
    LOAD_FAVORITES_FROM_STORAGE(state) {
      const stored = localStorage.getItem('favorites');
      if (stored) {
        state.favorites = JSON.parse(stored);
      }
    },
    CLEAR_SEARCH_RESULTS(state) {
      state.searchResults = [];
    }
  },
  actions: {
    async fetchRecipes({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        commit('SET_RECIPES', response.data.meals || []);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async searchRecipes({ commit }, query) {
      commit('SET_LOADING', true);
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        commit('SET_SEARCH_RESULTS', response.data.meals || []);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchRecipeById({ commit }, id) {
      commit('SET_LOADING', true);
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        commit('SET_CURRENT_RECIPE', response.data.meals ? response.data.meals[0] : null);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchCategories({ commit }) {
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/categories.php');
        commit('SET_CATEGORIES', response.data.categories || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    async filterByCategory({ commit }, category) {
      commit('SET_LOADING', true);
      try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
        commit('SET_SEARCH_RESULTS', response.data.meals || []);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async getRandomRecipe({ commit }) {
      commit('SET_LOADING', true);
      try {
        const response = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
        commit('SET_SEARCH_RESULTS', response.data.meals ? [response.data.meals[0]] : []);
        commit('SET_ERROR', null);
      } catch (error) {
        commit('SET_ERROR', error.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },

    loadFavorites({ commit }) {
      commit('LOAD_FAVORITES_FROM_STORAGE');
    },

    toggleFavorite({ commit, state }, recipe) {
      const isFavorite = state.favorites.find(fav => fav.idMeal === recipe.idMeal);
      if (isFavorite) {
        commit('REMOVE_FROM_FAVORITES', recipe.idMeal);
      } else {
        commit('ADD_TO_FAVORITES', recipe);
      }
    }
  },
  getters: {
    isFavorite: (state) => (recipeId) => {
      return state.favorites.some(recipe => recipe.idMeal === recipeId);
    },
    favoritesList: (state) => state.favorites,
    getRecipeById: (state) => (id) => {
      return state.recipes.find(recipe => recipe.idMeal === id) || 
             state.searchResults.find(recipe => recipe.idMeal === id);
    }
  }
};