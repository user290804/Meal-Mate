
<script>
import { mapState, mapActions, mapGetters } from 'vuex';

export default {
  name: 'Recipes',
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
    };
  },
  computed: {
    ...mapState('recipes', ['recipes', 'searchResults', 'categories', 'loading', 'error']),
    ...mapGetters('recipes', ['isFavorite']),
    
    displayedRecipes() {
      if (this.searchQuery || this.selectedCategory) {
        return this.searchResults;
      }
      return this.recipes;
    }
  },
  async mounted() {
    await this.loadRecipes();
    await this.fetchCategories();
  },
  methods: {
    ...mapActions('recipes', [
      'fetchRecipes',
      'searchRecipes',
      'fetchCategories',
      'filterByCategory',
      'getRandomRecipe',
      'toggleFavorite'
    ]),
    
    async loadRecipes() {
      await this.fetchRecipes();
    },
    
    async handleSearch() {
      if (this.searchQuery.trim()) {
        await this.searchRecipes(this.searchQuery);
      } else {
        this.$store.commit('recipes/CLEAR_SEARCH_RESULTS');
      }
    },
    
    async filterByCategory() {
      if (this.selectedCategory) {
        await this.$store.dispatch('recipes/filterByCategory', this.selectedCategory);
      } else {
        this.$store.commit('recipes/CLEAR_SEARCH_RESULTS');
      }
    },
    
    async getRandomRecipe() {
      await this.$store.dispatch('recipes/getRandomRecipe');
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.$store.commit('recipes/CLEAR_SEARCH_RESULTS');
    },
    
    viewRecipe(id) {
      this.$router.push(`/recipe/${id}`);
    },
    
    toggleFavorite(recipe) {
      this.$store.dispatch('recipes/toggleFavorite', recipe);
    }
  }
};
</script>
<template>
  <div class="recipes-container">
    <div class="header-section">
      <h1>Discover Delicious Recipes</h1>
      <p>Find your next favorite meal from our collection of recipes</p>
    </div>

    <!-- Search and Filter Section -->
    <div class="search-filter-section">
      <div class="search-bar">
        <input 
          v-model="searchQuery" 
          @input="handleSearch"
          type="text" 
          placeholder="Search recipes by name..."
          class="search-input"
        />
        <button @click="clearSearch" v-if="searchQuery" class="clear-btn">×</button>
      </div>

      <div class="filter-controls">
        <select v-model="selectedCategory" @change="filterByCategory" class="category-select">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.idCategory" :value="category.strCategory">
            {{ category.strCategory }}
          </option>
        </select>

        <button @click="getRandomRecipe" class="random-btn">
          🎲 Random Recipe
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading recipes...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="loadRecipes" class="retry-btn">Try Again</button>
    </div>

    <!-- Recipe Grid -->
    <div v-if="!loading && !error" class="recipe-grid">
      <div 
        v-for="recipe in displayedRecipes" 
        :key="recipe.idMeal"
        class="recipe-card"
        @click="viewRecipe(recipe.idMeal)"
      >
        <div class="recipe-image">
          <img :src="recipe.strMealThumb" :alt="recipe.strMeal" />
          <button 
            @click.stop="toggleFavorite(recipe)"
            :class="['favorite-btn', { 'active': isFavorite(recipe.idMeal) }]"
          >
            {{ isFavorite(recipe.idMeal) ? '⭐' : '✩' }}
          </button>
        </div>
        <div class="recipe-info">
          <h3>{{ recipe.strMeal }}</h3>
          <p class="category">{{ recipe.strCategory }}</p>
          <p class="area">{{ recipe.strArea }}</p>
        </div>
      </div>
    </div>

    <!-- No Results -->
    <div v-if="!loading && !error && displayedRecipes.length === 0" class="no-results">
      <p>No recipes found. Try a different search or category!</p>
    </div>
  </div>
</template>


<style scoped>
.recipes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  margin-top:3rem;
  text-align: center;
  margin-bottom: 40px;
}

.header-section h1 {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.header-section p {
  color:rgb(226, 222, 222);
  font-size: 1.2rem;
}

.search-filter-section {
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  align-items: center;
}

.search-bar {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-input {
  width: 100%;
  padding: 12px 40px 12px 15px;
  border: 2px solid #ddd;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #3498db;
}

.clear-btn {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.filter-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-left:3rem;
}

.category-select {
  padding: 10px 15px;
  border: 2px solid #ddd;
  border-radius: 20px;
  font-size: 16px;
  outline: none;
  background: white;
}

.random-btn {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.random-btn:hover {
  background: #2980b9;
}

.loading-state, .error-state, .no-results {
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
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state p {
  color: #e74c3c;
  margin-bottom: 20px;
}

.retry-btn {
  padding: 10px 20px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.recipe-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.recipe-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.recipe-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.recipe-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.recipe-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.favorite-btn.active {
  background: rgba(240, 227, 112, 0.9);
}

.recipe-info {
  padding: 20px;
}

.recipe-info h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.recipe-info .category,
.recipe-info .area {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 5px 0;
}

@media (max-width: 768px) {
  .search-filter-section {
    flex-direction: column;
  }
  
  .search-bar {
    min-width: 100%;
  }
  
  .recipe-grid {
    grid-template-columns: 1fr;
  }
}
</style>
