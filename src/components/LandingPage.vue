<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goTo = (route) => {
  router.push(route);
};
</script>

<template>
  <div class="landing-page">
    <el-menu
      class="navbar"
      mode="horizontal"
      background-color="rgba(255,255,255,0.85)"
    >
      <div class="logo-container">
        <img src="/logo.png" alt="MealMate Logo" class="logo" />
      </div>
      <el-menu-item index="login" @click="goTo('/Login')">Login</el-menu-item>
      <el-menu-item index="signup" @click="goTo('/Signup')"
        >Signup</el-menu-item
      >
    </el-menu>
    <div class="content"></div>
  </div>
</template>

<style scoped>
/* Remove the global CSS reset that was affecting other pages */

.landing-page {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: url("/bg2.jpg") center/cover no-repeat;
  background-origin: border-box;
  background-clip: border-box;
}

.navbar {
  width: 100%;
  border-radius: 0;
  background-color: rgba(255, 255, 255, 0.85);
  display: flex;
  justify-content:center;
  align-items: center;
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

.content {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

/* Responsive styles */
@media (max-width: 600px) {
  .welcome-content {
    padding: 1.2rem 0.5rem;
    max-width: 95vw;
  }
  .content {
    padding: 0.5rem;
  }
  .navbar {
    font-size: 0.95rem;
  }
  .logo {
    height: 30px;
  }
}
</style>
