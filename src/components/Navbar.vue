<script setup>
import {
  House,
  KnifeFork,
  SwitchButton,
  ShoppingCart,
  Notebook,
  Star,
  UserFilled
} from "@element-plus/icons-vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ElMessageBox } from "element-plus";

const store = useStore();
const router = useRouter();

const confirmLogout = () => {
  ElMessageBox.confirm("Are you sure you want to log out?", "Confirm Logout", {
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    type: "warning",
  })
    .then(() => {
      logout();
    })
    .catch(() => {
      // Cancelled
    });
};

const logout = () => { store.dispatch("user/logout"); 
router.push("/LandingPage");
};

</script>

<template>
  <header>
    <div class="whole-nav">
      <div class="logo-container">
        <img src="/logo.png" alt="MealMate" class="logo" />
      </div>
      <el-menu
        mode="horizontal"
        class="navbar"
        background-color="rgba(255,255,255,0.85)"
        router
      >
        <el-menu-item index="/Home">
          <el-icon><House /></el-icon> Home
        </el-menu-item>

        <el-menu-item index="/MealList">
          <el-icon><KnifeFork /></el-icon> Meals
        </el-menu-item>

        <el-menu-item index="/GroceryList">
          <el-icon><ShoppingCart /></el-icon> Grocery List
        </el-menu-item>

        <el-menu-item index="/Recipes">
          <el-icon><Notebook /></el-icon> Recipes
        </el-menu-item>

        <el-menu-item index="/Favorites">
          <el-icon><Star /></el-icon> Favorites
        </el-menu-item>

        <!-- Profile Dropdown -->
        <el-sub-menu index="profile" class="profile-menu">
          <template #title>
            <el-icon><UserFilled /></el-icon>
          </template>
          <el-menu-item @click="confirmLogout">
            <el-icon><SwitchButton /></el-icon> Logout
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  </header>
</template>

<style scoped>
.whole-nav {
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  height: auto;
  background-color: rgba(255, 255, 255, 0.85);
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}

header .navbar {
  width: 100%;
  display: flex;
  justify-content: space-evenly; 
  align-items: center;
  border-bottom: none;
  background-color: rgba(255, 255, 255, 0.85);
}

header .el-menu-item {
  font-size: 1rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;
  color: #333;
}

.logo-container {
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 1rem;
}

.logo {
  height: 40px;
  width: auto;
  object-fit: contain;
}

@media (max-width: 600px) {
  .whole-nav {
    flex-wrap: wrap;
    height: auto;
    padding: 0;
  }

  header .navbar {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  header .el-menu-item {
    width: 100%;
    justify-content: center;
    padding: 0.5rem 0;
  }

  .logo {
    height: 30px;
  }
}

header .el-menu-item:hover {
  background-color: #f5f5f5;
  cursor: pointer;
}

.profile-menu .el-sub-menu__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  color: #333;
}

</style>
