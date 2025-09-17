<script setup>
import { useStore } from "vuex";
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { Plus } from "@element-plus/icons-vue";
import axios from 'axios'; 

const imageSrc = "/cooking.png";
const store = useStore();
const router = useRouter();

const isNewUser = ref(false);

import { watch } from "vue";

const user = computed(() => store.state.user);

onMounted(async () => {
  try {
    // Check if user is new from localStorage
    if (localStorage.getItem("isNewUser") === "true") {
      isNewUser.value = true;
      localStorage.removeItem("isNewUser");
    }

    console.log("User data:", user.value);

    const userId = user.value.userId;
    if (userId) {
      await store.dispatch("meal/fetchMeals");
      const today = new Date().toISOString().split("T")[0];
      const meals = store.state.meal?.meals || [];
      const deletions = meals
        .filter((meal) => meal.date < today)
        .map(async (meal) => {
          await axios.delete(`/meals/${meal.id}`);
        });
      await Promise.all(deletions);
      // Fetch meals again after deletions
      await store.dispatch("meal/fetchMeals");
    }
  } catch (error) {
    console.error("Error fetching meals:", error);
  }
  console.log("User's First Name: ", user.value?.firstName);
});

watch(
  () => user.value.userId,
  async (newUserId) => {
    if (newUserId) {
      try {
        await store.dispatch("meal/fetchMeals");
      } catch (error) {
        console.error("Error fetching meals on userId change:", error);
      }
    }
  }
);

const handleMeal = () => {
  router.push("/Addmeal");
};

const breakfastMeals = computed(() => store.getters["meal/breakfastMeals"]);
const lunchMeals = computed(() => store.getters["meal/lunchMeals"]);
const dinnerMeals = computed(() => store.getters["meal/dinnerMeals"]);
const snackMeals = computed(() => store.getters["meal/snackMeals"]);
const dessertMeals = computed(() => store.getters["meal/dessertMeals"]);

const todayMeals = computed(() => {
  const today = new Date().toISOString().split("T")[0];
  console.log("Today's Date: ", today);
  return [
    ...breakfastMeals.value,
    ...lunchMeals.value,
    ...dinnerMeals.value,
    ...snackMeals.value,
    ...dessertMeals.value,
  ].filter(meal => meal.date === today); 
});
</script>

<template>
  <header></header>
  <main>
    <div class="main-body">
      <h1>
        <span v-if="!isNewUser">Hello! It's great to have you back.</span>
        <span v-else>Welcome On-board!</span>
      </h1>
      <h2>Let's plan your meals for the week.</h2>
      <p v-if="todayMeals.length === 0">
        No meals yet — let's add your first one!
      </p>
      <p v-else>Here's what you're cooking today:</p>
      <img :src="imageSrc" alt="Meal Planning Illustration" class="cooking" />
      <el-button type="primary" @click="handleMeal">
        <el-icon><Plus /></el-icon>
        Add Meal
      </el-button>
    </div>
    <div v-if="todayMeals.length > 0">
      <h3>Today's Meals</h3>
      <table>
        <thead>
          <tr style="color:white">
            <th>Meal Type</th>
            <th>Meal Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meal in todayMeals" :key="meal.id" style="color:rgb(226, 222, 222)">
            <td>{{ meal.mealTime }}</td>
            <td>{{ meal.mealName }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else>No meals planned for today yet!</p>
  </main>
  <footer></footer>
</template>

<style>
main {
  margin-top: 5.7rem;
}

.main-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 2rem;
  min-height: calc(100vh - 5.7rem);
}

.main-body h1,
.main-body h2,
.main-body p {
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2.5rem;
  color:white
}

h2 {
  font-size: 2rem;
  color:white;
}
h3{
   font-size: 1.5rem;
  color:white;
}

p {
  color: rgb(226, 222, 222);
  font-size: 1.25rem;
}

main .el-icon {
  margin-right: 0.4rem;
}

.main-body > .el-button {
  width: 100%;
  font-weight: bold;
  height: 2.8rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  text-align: center;
  padding: 1.6rem;
  background-color:white !important;
  color:#484A5A;
  transition: 0.3s ease;
  width: 100%;
}
.main-body> .el-button:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
 background-color: #989ec4 !important;
}

.cooking {
  max-width: 400px;
  width: 100%;
  height: auto;
  margin: 2rem 0;
}

.main-body .el-button:hover {
  background-color: #a58fa0;
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}
@media (max-width: 600px) {
  .cooking {
    max-width: 100%;
    margin: 1.5rem 0;
  }
}
table {
  width: 110%;
}
</style>
