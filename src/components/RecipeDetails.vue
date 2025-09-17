<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "RecipeDetails",
  props: ["id"],
  computed: {
    ...mapState("recipes", ["currentRecipe", "loading", "error"]),
    ...mapGetters("recipes", {
      isFavoriteGetter: "isFavorite",
    }),

    recipe() {
      return this.currentRecipe;
    },

    isFavorite() {
      return this.isFavoriteGetter(this.id);
    },
    ingredients() {
      if (!this.recipe) return [];

      const ingredients = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = this.recipe[`strIngredient${i}`];
        const measure = this.recipe[`strMeasure${i}`];

        if (ingredient && ingredient.trim()) {
          ingredients.push({
            name: ingredient,
            measure: measure || "",
          });
        }
      }
      return ingredients;
    },

    formattedInstructions() {
      if (!this.recipe || !this.recipe.strInstructions) return "";
      return this.recipe.strInstructions
        .split("\r\n")
        .filter((line) => line.trim())
        .map((line) => `<p>${line}</p>`)
        .join("");
    },

    youtubeEmbedUrl() {
      if (!this.recipe || !this.recipe.strYoutube) return "";
      const videoId = this.recipe.strYoutube.split("v=")[1];
      return `https://www.youtube.com/embed/${videoId}`;
    },
  },
  async mounted() {
    await this.loadRecipe();
    this.$store.dispatch("recipes/loadFavorites");
  },
  methods: {
    ...mapActions("recipes", ["fetchRecipeById", "toggleFavorite"]),

    async loadRecipe() {
      await this.fetchRecipeById(this.id);
    },

    goBack() {
      this.$router.push("/Recipes");
    },

    toggleFavorite() {
      this.$store.dispatch("recipes/toggleFavorite", this.recipe);
    },

    addToMealPlan() {
      // Navigate to Addmeal page with recipe name pre-filled
      this.$router.push({
        path: '/Addmeal',
        query: { 
          recipeName: this.recipe.strMeal,
          recipeId: this.id
        }
      });
    },

    addToGroceryList() {
      // Get or create a default grocery list and add ingredients
      const ingredients = this.ingredients.map((item) => ({
        name: item.name,
        quantity: item.measure || '1',
        purchased: false
      }));
      
      // Use the first available grocery list or create a new one
      this.$store.dispatch("grocery/fetchGroceryLists").then(() => {
        const lists = this.$store.state.grocery.groceryLists;
        let targetListId;
        
        if (lists && lists.length > 0) {
          targetListId = lists[0].id;
        } else {
          // Create a new grocery list if none exists
          return this.$store.dispatch("grocery/createGroceryList", {
            name: `${this.recipe.strMeal} Ingredients`,
            description: `Ingredients for ${this.recipe.strMeal}`
          }).then(newList => {
            targetListId = newList.id;
            return targetListId;
          });
        }
        return targetListId;
      }).then(listId => {
        // Add each ingredient to the grocery list
        const addPromises = ingredients.map(ingredient => 
          this.$store.dispatch("grocery/addItemToList", {
            listId: listId,
            item: ingredient
          })
        );
        return Promise.all(addPromises);
      }).then(() => {
        alert("Ingredients added to grocery list!");
      }).catch(error => {
        console.error("Error adding to grocery list:", error);
        alert("Error adding ingredients to grocery list. Please try again.");
      });
    },
  },
};
</script>

<template>
  <div v-if="recipe" class="recipe-details">
    <div class="back-button">
      <button @click="goBack" class="back-btn">← Back to Recipes</button>
    </div>

    <div class="recipe-header">
      <h1>{{ recipe.strMeal }}</h1>
      <div class="recipe-meta">
        <span class="category">{{ recipe.strCategory }}</span>
        <span class="area">{{ recipe.strArea }}</span>
        <span v-if="recipe.strTags" class="tags">
          <span v-for="tag in recipe.strTags.split(',')" :key="tag" class="tag">
            {{ tag.trim() }}
          </span>
        </span>
      </div>
    </div>

    <div class="recipe-content">
      <div class="recipe-image-section">
        <img
          :src="recipe.strMealThumb"
          :alt="recipe.strMeal"
          class="recipe-image"
        />
        <button
          @click="toggleFavorite"
          :class="['favorite-btn', { active: isFavorite }]"
        >
          {{ isFavorite ? "⭐ Remove from Favorites" : "✩ Add to Favorites" }}
        </button>
      </div>

      <div class="recipe-info">
        <div class="ingredients-section">
          <h2>Ingredients</h2>
          <ul class="ingredients-list">
            <li v-for="(ingredient, index) in ingredients" :key="index">
              <span class="ingredient">{{ ingredient.name }}</span>
              <span class="measure">{{ ingredient.measure }}</span>
            </li>
          </ul>
        </div>

        <div class="instructions-section">
          <h2>Instructions</h2>
          <div class="instructions" v-html="formattedInstructions"></div>
        </div>

        <div v-if="recipe.strYoutube" class="video-section">
          <h2>Video Tutorial</h2>
          <div class="video-container">
            <iframe
              :src="youtubeEmbedUrl"
              frameborder="0"
              allowfullscreen
            ></iframe>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="addToMealPlan" class="action-btn meal-plan-btn">
            📅 Add to Meal Plan
          </button>
          <button @click="addToGroceryList" class="action-btn grocery-btn">
            🛒 Add to Grocery List
          </button>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="loading" class="loading-state">
    <div class="spinner"></div>
    <p>Loading recipe details...</p>
  </div>

  <div v-else-if="error" class="error-state">
    <p>{{ error }}</p>
    <button @click="loadRecipe" class="retry-btn">Try Again</button>
  </div>
</template>

<style scoped>
.recipe-details {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  margin-top: 3rem;
  margin-bottom: 20px;
}

.back-btn {
  background: #ffffff;
  color: rgb(0, 0, 0);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.back-btn:hover {
  background: #989ec4;
}

.recipe-header {
  text-align: center;
  margin-bottom: 30px;
}

.recipe-header h1 {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 15px;
}

.recipe-meta {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.category,
.area {
  background: #ffffff;
  color: rgb(0, 0, 0);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
}

.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background: #e74c3c;
  color: white;
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 12px;
}

.recipe-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  margin-top: 30px;
}

.recipe-image-section {
  text-align: center;
}

.recipe-image {
  width: 100%;
  max-width: 400px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.favorite-btn {
  margin-top: 20px;
  padding: 12px 30px;
  border: 2px solid #e74c3c;
  background: white;
  color: #e74c3c;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.favorite-btn:hover {
  background: #e74c3c;
  color: white;
}

.favorite-btn.active {
  background: #e74c3c;
  color: white;
}

.ingredients-section,
.instructions-section,
.video-section {
  margin-bottom: 30px;
}

.ingredients-section h2,
.instructions-section h2,
.video-section h2 {
  color:rgb(226, 222, 222);
  margin-bottom: 15px;
}

.ingredients-list {
  list-style: none;
  padding: 0;
}

.ingredients-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.ingredient {
  font-weight: bold;
  color: rgb(226, 222, 222);
}

.measure {
  color: rgb(226, 222, 222);
}

.instructions p {
  margin-bottom: 15px;
  line-height: 1.6;
  color: #34495e;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.action-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
}

.action-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s;
}

.meal-plan-btn {
  background: #2ecc71;
  color: white;
}

.meal-plan-btn:hover {
  background: #27ae60;
}

.grocery-btn {
  background: #f39c12;
  color: white;
}

.grocery-btn:hover {
  background: #e67e22;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.retry-btn {
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .recipe-content {
    grid-template-columns: 1fr;
  }

  .recipe-meta {
    flex-direction: column;
    align-items: center;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
