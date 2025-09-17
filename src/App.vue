<script setup>
import { useRoute } from "vue-router";
import Navbar from "./components/Navbar.vue";

const route = useRoute();
</script>

<template>
  <div>
    <!-- Only show gradient background if not on LandingPage -->
    <div v-if="route.name !== 'LandingPage'" class="app-bg"></div>
    <router-view />
    <Navbar
      v-if="
        route.path !== '/Login' &&
        route.path !== '/Signup' &&
        route.path !== '/LandingPage'
      "
    />
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap");

* {
  margin: 0;
  padding: 0;
}
body {
  background-color: #484A5A;
  color: #000000;
  font-family: "Roboto", sans-serif;
  overflow-x: hidden;
  height: 100%;
}

.app-bg {

  min-height: 100vh;
  width: 100%; /* Adjust to prevent horizontal overflow */

  position: fixed; /* Fixes the background in place */
  top: 0;
  left: 0;
  z-index: -1; /* Ensure it doesn't overlap other elements */
}

.router-view {
  flex: 1; /* Ensures that the content fills the remaining space */
}
</style>
