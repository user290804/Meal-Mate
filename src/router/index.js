import { createRouter, createWebHistory } from "vue-router";
import Login from "../components/Login.vue";
import Signup from "../components/Signup.vue";
import Home from "../components/Home.vue";
import MealList from "../components/MealList.vue";
import Addmeal from "../components/Addmeal.vue";
import LandingPage from "../components/LandingPage.vue";
import GroceryList from "../components/GroceryList.vue";
import Recipes from "../components/Recipes.vue";
import RecipeDetails from "../components/RecipeDetails.vue";
import Favorites from "../components/Favorites.vue";

const routes = [
  { path: "/", redirect: "/LandingPage" },
   { path: "/LandingPage", component: LandingPage },
  { path: "/Login", component: Login },
  { path: "/Signup", component: Signup },
  { path: "/Home", component: Home },
   { path: "/Addmeal", component: Addmeal },
   { path: "/MealList", component: MealList },
   { path: "/GroceryList", component: GroceryList },
   { path: "/Recipes", component: Recipes },
   { path: "/recipe/:id", component: RecipeDetails, props: true },
   { path: "/favorites", component: Favorites },
]
export const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
