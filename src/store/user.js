// User.js
import { apiService } from '../api/api.js';

export default {
  namespaced: true,
  state: {
    users: null,
    isAuthenticated: false,
    user: null,
    userId: null,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      state.isAuthenticated = true;
      state.userId = user.id;
      localStorage.setItem("user", JSON.stringify(user));
    },
    clearUser(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.userId = null;
      localStorage.removeItem("user");
    },
    initializeUser(state) {
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        state.user = user;
        state.isAuthenticated = true;
        state.userId = user.id;
      }
    },
  },
  actions: {
    async signup({ commit }, { email, firstName, lastName, password }) {
      try {
        // Check if email already exists via API
        const existingUsers = await apiService.get('/users');
        if (existingUsers.some(user => user.email === email)) {
          throw new Error("Email already exists");
        }

        // Create new user
        const newUser = {
          email,
          firstName,
          lastName,
          password: password, // Store password as plain text
          createdAt: new Date().toISOString()
        };
        
        // Add to JSON server
        const createdUser = await apiService.post('/users', newUser);
        
        // Set current user
        commit("setUser", createdUser);
        return true;
      } catch (error) {
        console.error("Signup error:", error);
        if (error.message === "Email already exists") {
          return error.message;
        }
        return false;
      }
    },

    async fetchUser({ commit }, { email, password }) {
      try {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Get users from JSON server
        const users = await apiService.get('/users');
        
        // Find user by email and password
        const user = users.find(u => u.email === trimmedEmail && u.password === trimmedPassword);
        
        if (user) {
          commit("setUser", user);
          return true;
        }
        return false;
      } catch (error) {
        console.error("Login error:", error);
        return false;
      }
    },

    logout({ commit, dispatch }) {
      commit("clearUser");
      dispatch("meal/clearMeals", null, { root: true });
    },
  },
  getters: {
    isUserLoggedIn(state) {
      return state.isAuthenticated && state.user !== null;
    },
  },
};
