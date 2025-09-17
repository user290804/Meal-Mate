<script setup>
import { onMounted, computed, watch } from "vue";
import { Delete, Edit } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();

const mealOrder = {
  Breakfast: 1,
  Lunch: 2,
  Dinner: 3,
  Snacks: 4,
  Dessert: 5,
};

const groupedMeals = computed(() => {
  const meals = store.getters["meal/allMeals"];
  const groups = {};

  meals.forEach((meal) => {
    if (!groups[meal.date]) {
      groups[meal.date] = [];
    }
    groups[meal.date].push(meal);
  });

  for (const date in groups) {
    groups[date].sort((a, b) => mealOrder[a.mealTime] - mealOrder[b.mealTime]);
  }
  return groups;
});

// Format date to show day of week and date
const formatDate = (dateString) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', options);
};

// Get color based on meal type
const getMealTypeColor = (mealType) => {
  const colors = {
    Breakfast: '#FFD700',
    Lunch: '#FF6347',
    Dinner: '#4169E1',
    Snacks: '#32CD32',
    Dessert: '#FF69B4'
  };
  return colors[mealType] || '#808080';
};

const editMeal = (meal) => {
  router.push({ path: "/Addmeal", query: { id: meal.id } });
};

const deleteMeal = async (mealId) => {
  // Confirm before deleting
  if (confirm("Are you sure you want to delete this meal?")) {
    try {
      await store.dispatch("meal/deleteMeal", mealId);
    } catch (error) {
      console.error("Failed to delete meal:", error);
      alert("Failed to delete meal. Please try again.");
    }
  }
};

onMounted(() => {
  const userId = store.state.user.userId;
  if (userId) {
    store.dispatch("meal/fetchMeals");
  }
});

watch(
  () => store.state.user.userId,
  (newUserId) => {
    if (newUserId) {
      store.dispatch("meal/fetchMeals");
    }
  }
);
</script>

<template>
  <div class="main">
    <div v-if="Object.keys(groupedMeals).length === 0" class="empty-state">
      <h2>No Meals Planned</h2>
      <p>You haven't planned any meals yet. Start by adding your first meal!</p>
    </div>
    <div v-for="(meals, date) in groupedMeals" :key="date" class="meal-day">
      <h2>{{ formatDate(date) }}</h2>
      <div v-for="meal in meals" :key="meal.id" class="meal-entry">
        <div class="meal-info">
          <span class="meal-type" :style="{ backgroundColor: getMealTypeColor(meal.mealTime) }">
            {{ meal.mealTime }}
          </span>
          <span class="meal-name">{{ meal.mealName }}</span>
        </div>
        <div class="btns">
          <el-button
            type="primary"
            @click="editMeal(meal)"
            class="edit-btn"
          >
            <el-icon><Edit /></el-icon>
            Edit
          </el-button>
          <el-button
            type="danger"
            @click="deleteMeal(meal.id)"
            class="delete-btn"
          >
            <el-icon><Delete /></el-icon>
            Delete
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.main {
  width: 30rem;
  background-color: #ffffff;
  margin: 7rem auto 3rem;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-state h2 {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

.empty-state p {
  color: #666;
  font-size: 1.1rem;
}

h2 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
  text-align: center;
  color: #333;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #f0f0f0;
}

.meal-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 0.75rem;
  background-color: #fafafa;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
}

.meal-entry:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.meal-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meal-type {
  align-self: flex-start;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.meal-name {
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
}

.btns {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.edit-btn, .delete-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  border: none;
  color: white;
  cursor: pointer;
}

.edit-btn {
  background-color: #484A5A !important;
}

.edit-btn:hover:not(:disabled) {
  background-color: #989ec4 !important;
}

.delete-btn {
  background-color: #e74c3c !important;
}

.delete-btn:hover:not(:disabled) {
  background-color: #c0392b !important;
}

.edit-btn:disabled, .delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.meal-day {
  background-color: #fefefe;
  padding: 1.5rem;
  margin-bottom: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

@media (max-width: 600px) {
  .main {
    width: calc(100% - 2rem);
    margin: 7rem 1rem 3rem;
    padding: 1.5rem;
  }
  
  .meal-entry {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .btns {
    width: 100%;
    justify-content: flex-end;
    margin-top: 1rem;
  }
  
  .meal-info {
    width: 100%;
  }
}
</style>
