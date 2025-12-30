const { createMachine, assign } = require("xstate");
const mealPlannerMachine = createMachine({
  id: "meal",
  initial: "LandingPage",
  predictableActionArguments: true,
  context: {
    user: null,
    groceryLists: [],
    currentList: null,
    showCreateListInput: false,
    showAddItemInput: false,
    newItemName: "",
    newListName: "",
  },
  states: {
    LandingPage: {
      on: {
        Login: {
          target: "LOGIN",
          actions: ["loginAccount"],
        },
        Signup: {
          target: "SIGNUP",
          actions: ["signupAccount"],
        },
      },
    },
    LOGIN: {
      on: {
        Login_Success: {
          target: "HOME",
          actions: ["loginSuccess"],
        },
        Login_Failure: {
          target: "LOGIN",
          actions: ["logError"],
        },
        Signup: {
          target: "SIGNUP",
          actions: ["goToSignup"],
        },
      },
    },

    SIGNUP: {
      on: {
        Signup_Success: {
          target: "LOGIN",
          actions: ["signupSuccess"],
        },
        Signup_Failure: {
          target: "SIGNUP",
          actions: ["logError"],
        },
      },
    },
    HOME: {
      on: {
        Meals_List: {
          target: "MEALS_LIST",
          actions: ["goToMealsList"],
        },
        Grocery_List: {
          target: "GROCERY_LIST",
          actions: ["goToGrocery"],
        },
        Recipes: {
          target: "RECIPES",
          actions: ["goToRecipes"],
        },
        Favorites: {
          target: "FAVORITES",
          actions: ["goToFavorites"],
        },
        Logout: {
          target: "LOGIN",
          actions: "logoutAccount",
        },
        Add_Meal: {
          target: "ADD_MEAL",
          actions: "goToAddMeal",
        },
      },
    },
    MEALS_LIST: {
      on: {
        Home: {
          target: "HOME",
          actions: "goToHome",
        },
        Grocery_List: {
          target: "GROCERY_LIST",
          actions: "goToGrocery",
        },
        Recipes: {
          target: "RECIPES",
          actions: "goToRecipes",
        },
        Favorites: {
          target: "FAVORITES",
          actions: "goToFavorites",
        },
        Logout: {
          target: "LOGIN",
          actions: "logoutAccount",
        },
        Edit_Meal: {
          target: "ADD_MEAL",
          actions: "goToAddMeal",
        },
        Delete_Meal: {
          actions: ["deleteMeal"],
        },
      },
    },
    GROCERY_LIST: {
      on: {
        Home: {
          target: "HOME",
          actions: "goToHome",
        },
        Logout: {
          target: "LOGIN",
          actions: "logoutAccount",
        },
        Meals_List: {
          target: "MEALS_LIST",
          actions: "goToMealsList",
        },
        Recipes: {
          target: "RECIPES",
          actions: "goToRecipes",
        },
        Favorites: {
          target: "FAVORITES",
          actions: "goToFavorites",
        },
        Create_New_List: {
          actions: ["showCreateListInput", "focusOnInput"],
        },
        Add_Item: {
          actions: ["showAddItemInput", "focusOnItemInput"],
        },
        Cancel_Create_List: {
          actions: "hideCreateListInput",
        },
        Cancel_Add_Item: {
          actions: "hideAddItemInput",
        },
      },
    },
    RECIPES: {
      on: {
        Home: {
          target: "HOME",
          actions: "goToHome",
        },
        Logout: {
          target: "LOGIN",
          actions: "logoutAccount",
        },
        Meals_List: {
          target: "MEALS_LIST",
          actions: "goToMealsList",
        },
        Grocery_List: {
          target: "GROCERY_LIST",
          actions: "goToGrocery",
        },
        Favorites: {
          target: "FAVORITES",
          actions: "goToFavorites",
        },
        Search_Recipe: {
          actions: "searchRecipe",
        },
        Select_Category: {
          actions: "selectCategory",
        },
        Random_Recipe: {
          actions: "getRandomRecipe",
        },
        View_RecipeDetails: {
          target: "RECIPE_DETAILS",
          actions: "viewRecipeDetails",
        },
        Mark_Favorite: {
          actions: "markRecipeAsFavorite",
        },
        Unmark_Favorite: {
          actions: "unmarkRecipeAsFavorite",
        },
        Retry: {
          target: "RECIPES",
          actions: "retryRecipeSearch",
        },
      },
    },
    RECIPE_DETAILS: {
      on: {
        Home: {
          target: "HOME",
          actions: "goToHome",
        },
        Logout: {
          target: "LOGIN",
          actions: "logoutAccount",
        },
        Meals_List: {
          target: "MEALS_LIST",
          actions: "goToMealsList",
        },
        Grocery_List: {
          target: "GROCERY_LIST",
          actions: "goToGrocery",
        },
        Favorites: {
          target: "FAVORITES",
          actions: "goToFavorites",
        },
        Recipes: {
          target: "RECIPES",
          actions: "goToRecipes",
        },
        Back_To_Recipes: {
          target: "RECIPES",
          actions: "goToRecipes",
        },
        Add_To_Favorites: {
          actions: "markRecipeAsFavorite",
        },
        Remove_From_Favorites: {
          actions: "unmarkRecipeAsFavorite",
        },
        Watch_Video: {
          actions: "watchRecipeVideo",
        },
        Add_To_Meal_Plan: {
          target: "ADD_MEAL",
          actions: "addRecipeToMealPlan",
        },
        Add_To_Grocery_List: {
          actions: "addIngredientsToGroceryList",
        },
      },
    },
    FAVORITES: {
      on: {
        Home: {
          target: "HOME",
          actions: "goToHome",
        },
        Logout: {
          target: "LOGIN",
          actions: "logoutAccount",
        },
        Meals_List: {
          target: "MEALS_LIST",
          actions: "goToMealsList",
        },
        Grocery_List: {
          target: "GROCERY_LIST",
          actions: "goToGrocery",
        },
        Recipes: {
          target: "RECIPES",
          actions: "goToRecipes",
        },
        View_Recipe: {
          target: "RECIPE_DETAILS",
          actions: "viewRecipeDetails",
        },
      },
    },

    ADD_MEAL: {
      on: {
        Meals_List: {
          target: "MEALS_LIST",
          actions: ["goToMealsList"],
        },
        Grocery_List: {
          target: "GROCERY_LIST",
          actions: ["goToGrocery"],
        },
        Recipes: {
          target: "RECIPES",
          actions: ["goToRecipes"],
        },
        Favorites: {
          target: "FAVORITES",
          actions: ["goToFavorites"],
        },
        Logout: {
          target: "LOGIN",
          actions: "logoutAccount",
        },
        Home: {
          target: "HOME",
          actions: "goToHome",
        },
        Add_Meal_Btn: {
          actions: "addMeal",
        },
      },
    },
    LOGOUT: {
      on: {
        CONFIRM_LOGOUT: {
          target: "LandingPage",
          actions: "logoutAccount",
        },
        CANCEL_LOGOUT: {
          actions: "cancelLogout",
        },
      },
    },
  },
  actions: {
    loginAccount: assign((context, event) => {
      return { user: event.user };
    }),
    signupAccount: assign((context, event) => {
      return { user: event.user };
    }),
    loginSuccess: assign((context, event) => {
      return { user: event.user };
    }),
    logError: assign((context, event) => {
      console.error("Error:", event.error);
      return { error: event.error };
    }),

    // Placeholder actions for navigation
    goToMealsList: (_context, _event) => {
      console.log("Navigating to Meals List");
    },
    goToGrocery: (_context, _event) => {
      console.log("Navigating to Grocery List");
    },
    goToRecipes: (_context, _event) => {
      console.log("Navigating to Recipes");
    },
    goToFavorites: (_context, _event) => {
      console.log("Navigating to Favorites");
    },
    logoutAccount: (_context, _event) => {
      console.log("Logging out...");
    },
    goToHome: (_context, _event) => {
      console.log("Navigating to Home");
    },

    // Meal related actions
    deleteMeal: (context, event) => {
      console.log("Deleting meal", event.mealId);
    },
    addMeal: (context, event) => {
      console.log("Adding meal", event.meal);
    },

    // Grocery related actions
    showCreateListInput: assign({
      showCreateListInput: true,
    }),
    hideCreateListInput: assign({
      showCreateListInput: false,
      newListName: "",
    }),
    showAddItemInput: assign({
      showAddItemInput: true,
    }),
    hideAddItemInput: assign({
      showAddItemInput: false,
      newItemName: "",
    }),

    // Recipe related actions
    searchRecipe: (context, event) => {
      console.log("Searching for recipe:", event.query);
    },
    selectCategory: (context, event) => {
      console.log("Selecting category:", event.category);
    },
    getRandomRecipe: (_context, _event) => {
      console.log("Getting a random recipe...");
    },
    viewRecipeDetails: (context, event) => {
      console.log("Viewing recipe details for:", event.recipeId);
    },
    markRecipeAsFavorite: (context, event) => {
      console.log("Marking recipe as favorite:", event.recipeId);
    },
    unmarkRecipeAsFavorite: (context, event) => {
      console.log("Unmarking recipe from favorites:", event.recipeId);
    },
    retryRecipeSearch: (_context, _event) => {
      console.log("Retrying recipe search");
    },

    // Video/meal plan actions
    watchRecipeVideo: (context, event) => {
      console.log("Watching recipe video:", event.videoId);
    },
    addRecipeToMealPlan: (context, event) => {
      console.log("Adding recipe to meal plan:", event.recipeId);
    },
    addIngredientsToGroceryList: (context, event) => {
      console.log("Adding ingredients to grocery list:", event.ingredients);
    },
    cancelLogout: (_context, _event) => {
      console.log("Canceling logout");
    },
    goToSignup: (_context, _event) => {
      console.log("Navigating to Signup page");
    },

    //UI-specific actions
    focusOnInput: assign({
      showCreateListInput: true,
    }),
    focusOnItemInput: assign({
      showAddItemInput: true,
    }),
  },
});
module.exports = mealPlannerMachine;
