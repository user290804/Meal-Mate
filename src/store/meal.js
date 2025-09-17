import axios from "../axios";

export default {
  namespaced: true,
  state: {
    meals: [],
  },
  mutations: {
    setMeals(state, meals) {
      state.meals = meals;
    },
    addMeal(state, meal) {
      state.meals.push(meal);
    },
    updateMeal(state, updatedMeal) {
      const index = state.meals.findIndex((meal) => meal.id === updatedMeal.id);
      if (index !== -1) {
        state.meals[index] = updatedMeal;
      }
    },
    deleteMeal(state, mealId) {
      state.meals = state.meals.filter((meal) => meal.id !== mealId);
    },
    clearMeals(state) {
      state.meals = [];
    },
  },
  actions: {
    async fetchMeals({ commit, rootState }) {
      try {
        const userId = rootState.user.userId;
        commit("clearMeals");
        const response = await axios.get(`/meals?userId=${userId}`);
        const meals = await response.data;

        commit("setMeals", meals);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    },

    async addMeal({ commit }, meal) {
      try {
        const response = await axios.post("/meals", meal, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const newMeal = await response.data;
        commit("addMeal", newMeal);
      } catch (error) {
        console.error("Error adding meal:", error);
      }
    },

    async updateMeal({ commit }, { mealId, mealData }) {
      try {
        const response = await axios.put(`/meals/${mealId}`, mealData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const updatedMeal = await response.data;
        commit("updateMeal", updatedMeal);
      } catch (error) {
        console.error("Error updating meal:", error);
      }
    },

    async deleteMeal({ commit }, mealId) {
      try {
        await axios.delete(`/meals/${mealId}`);
        commit("deleteMeal", mealId);
      } catch (error) {
        console.error("Error deleting meal:", error);
      }
    },
  },
  getters: {
    allMeals: (state, getters, rootState) => {
      const userId = rootState.user.userId;
      return state.meals.filter((meal) => meal.userId === userId);
    },
    breakfastMeals: (state, getters, rootState) => {
      const userId = rootState.user.userId;
      return state.meals.filter(
        (meal) => meal.mealTime === "Breakfast" && meal.userId === userId
      );
    },
    lunchMeals: (state, getters, rootState) => {
      const userId = rootState.user.userId;
      return state.meals.filter(
        (meal) => meal.mealTime === "Lunch" && meal.userId === userId
      );
    },
    dinnerMeals: (state, getters, rootState) => {
      const userId = rootState.user.userId;
      return state.meals.filter(
        (meal) => meal.mealTime === "Dinner" && meal.userId === userId
      );
    },
    snackMeals: (state, getters, rootState) => {
      const userId = rootState.user.userId;
      return state.meals.filter(
        (meal) => meal.mealTime === "Snacks" && meal.userId === userId
      );
    },
    dessertMeals: (state, getters, rootState) => {
      const userId = rootState.user.userId;
      return state.meals.filter(
        (meal) => meal.mealTime === "Dessert" && meal.userId === userId
      );
    },
  },
};
