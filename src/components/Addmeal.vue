<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { Calendar, Food, Plus } from "@element-plus/icons-vue";

const mname = ref("");
const mtype = ref("");
const mdate = ref("");
const store = useStore();
const router = useRouter();
const route = useRoute();

const mealId = route.query.id;

const selectedDate = ref("");
const value = ref("");

const options = [
  { value: "Breakfast", label: "Breakfast" },
  { value: "Lunch", label: "Lunch" },
  { value: "Dinner", label: "Dinner" },
  { value: "Snacks", label: "Snacks" },
  { value: "Dessert", label: "Dessert" },
];

onMounted(async () => {
  if (mealId) {
    try {
      const res = await fetch(`http://localhost:3000/meals/${mealId}`);
      if (!res.ok) {
        alert("Meal not found");
        return;
      }
      const data = await res.json();
      mname.value = data.mealName;
      value.value = data.mealTime;
      selectedDate.value = data.date;
    } catch (err) {
      alert("Error loading meal");
    }
  } else if (route.query.recipeName) {
    // Pre-fill recipe name when coming from RecipeDetails
    mname.value = route.query.recipeName;
  }
});

const submitMeal = async () => {
  if (!mname.value || !value.value || !selectedDate.value) {
    alert("All fields are required.");
    return;
  }

  const userId = store.state.user.userId;

  const mealData = {
    mealName: mname.value,
    mealTime: value.value,
    date: selectedDate.value,
    userId: userId,
  };

  try {
    if (mealId) {
      await store.dispatch("meal/updateMeal", { mealId, mealData });
      alert("Meal updated successfully!");
    } else {
      await store.dispatch("meal/addMeal", mealData);
      alert("Meal added successfully!");
    }
    mname.value = "";
    value.value = "";
    mdate.value = null;
 
  } catch (error) {
    console.error("Error:", error);
    alert("Network or server error occurred.");
  }
};
</script>
<template>
  <div class="container">
    <h1>{{ mealId ? "Edit Meal" : "Add a New Meal" }}</h1>
    <form @submit.prevent="submitMeal">
      <div class="form-group">
        <label for="date" class="floating-label">Select Date</label>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="Pick a date"
          format="DD-MM-YYYY"
          value-format="YYYY-MM-DD"
          size="large"
          style="width: 100%"
        >
          <template #prefix>
            <el-icon><Calendar /></el-icon>
          </template>
        </el-date-picker>
      </div>

      <div class="form-group">
        <label for="mealtime" class="floating-label">Meal Time</label>
        <el-select
          v-model="value"
          placeholder="Select meal type"
          class="meal-select"
          size="large"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      
      <div class="form-group">
        <label for="mealName" class="floating-label">Meal Name</label>
        <el-input
          id="mname"
          v-model="mname"
          size="large"
          clearable
          placeholder="e.g. Chicken Biryani"
        >
          <template #prefix>
            <el-icon><Food /></el-icon>
          </template>
        </el-input>
      </div>

      <el-button type="primary" native-type="submit" class="addmeal-btn">
        <el-icon><Plus /></el-icon>
        {{ mealId ? "Update Meal" : "Add Meal" }}
      </el-button>
    </form>
  </div>
</template>

<style scoped>
.container {
  width: 25rem;
  height: auto;
  margin: 7rem auto 3rem;
  padding: 2rem;
  border-radius: 1rem;
  background: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
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

h1 {
  text-align: center;
  font-size: 2.2rem;
  margin-bottom: 2rem;
  color: #404040;
  font-weight: 600;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  position: relative;
  margin-bottom: 1.5rem;
}

.floating-label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  display: block;
  color: #555;
  font-size: 0.95rem;
}

.el-input,
.meal-select {
  width: 100%;
}

.addmeal-btn {
  background-color: #484A5A !important;
  color: #ffffff;
  font-weight: 600;
  width: 100%;
  height: 3rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.addmeal-btn:hover:not(:disabled) {
  background-color: #989ec4 !important;
}

.addmeal-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .container {
    margin: 5rem 1rem;
    padding: 1.5rem;
    width: calc(100% - 2rem);
  }
  .addmeal-btn {
    font-size: 1rem;
    padding: 1rem;
  }
}
</style>
