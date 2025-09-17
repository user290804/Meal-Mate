<template>
  <div class="favorites-container">
    <div class="header-section">
      <h1>My Favorite Recipes</h1>
      <p>Your personal collection of saved recipes</p>
    </div>

    <div v-if="favorites.length === 0" class="empty-state">
      <div class="empty-icon">⭐</div>
      <h3 style="color:rgb(226, 222, 222);">No favorites yet</h3>
      <p style="color: rgb(226, 222, 222);">You haven't saved any recipes to your favorites yet.</p>
      <button @click="browseRecipes" class="browse-btn">Browse Recipes</button>
    </div>

    <div v-else>
      <div class="favorites-header">
        <p>{{ favorites.length }} favorite recipe{{ favorites.length !== 1 ? 's' : '' }} saved</p>
      </div>

      <div class="favorites-grid">
        <div 
          v-for="recipe in favorites" 
          :key="recipe.idMeal"
          class="favorite-card"
        >
          <div class="card-image">
            <img :src="recipe.strMealThumb" :alt="recipe.strMeal" />
            <button 
              @click="removeFromFavorites(recipe.idMeal)"
              class="remove-btn"
              title="Remove from favorites"
            >
              ×
            </button>
          </div>
          
          <div class="card-content">
            <h3>{{ recipe.strMeal }}</h3>
            <p class="category">{{ recipe.strCategory }}</p>
            <p class="area">{{ recipe.strArea }}</p>
            
            <div class="card-actions">
              <button @click="viewRecipe(recipe.idMeal)" class="view-btn">
                View Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'Favorites',
  computed: {
    ...mapState('recipes', ['favorites']),
  },
  methods: {
    ...mapActions('recipes', ['removeFromFavorites']),
    
    browseRecipes() {
      this.$router.push('/Recipes');
    },
    
    viewRecipe(id) {
      this.$router.push(`/recipe/${id}`);
    },
    
    removeFromFavorites(id) {
      this.removeFromFavorites(id);
    }
  }
};
</script>

<style scoped>
.favorites-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 40px;
  margin-top: 3rem;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.browse-btn {
  padding: 12px 30px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.browse-btn:hover {
  background: #2980b9;
}

.favorites-header {
  text-align: center;
  margin-bottom: 30px;
}

.favorites-header p {
  color: rgb(226, 222, 222);
  font-size: 1.1rem;
}

.favorites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.favorite-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
  position: relative;
}

.favorite-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background-color 0.3s;
}

.remove-btn:hover {
  background: rgba(192, 57, 43, 0.9);
}

.card-content {
  padding: 20px;
}

.card-content h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 1.3rem;
}

.card-content .category,
.card-content .area {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 5px 0;
}

.card-actions {
  margin-top: 15px;
}

.view-btn {
  width: 100%;
  padding: 10px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.view-btn:hover {
  background: #2980b9;
}

@media (max-width: 768px) {
  .favorites-grid {
    grid-template-columns: 1fr;
  }
}
</style>
