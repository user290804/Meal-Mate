import { createStore } from "vuex";
import user from "./user";
import meal from "./meal";
import grocery from "./grocery";
import recipes from "./recipes";


export default createStore({
  modules: {
    user,
    meal,
    grocery,
    recipes,
  },
});
