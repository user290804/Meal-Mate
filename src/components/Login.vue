<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";


const email = ref("");
const password = ref("");
const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const emailError = ref("");
const passwordError = ref("");

// Validate email and password
const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value.trim()) {
    emailError.value = "Email is required";
    return false;
  } else if (!emailRegex.test(email.value)) {
    emailError.value = "Please enter a valid email address";
    return false;
  } else {
    emailError.value = "";
    return true;
  }
};

const validatePassword = () => {
  if (!password.value.trim()) {
    passwordError.value = "Password is required";
    return false;
  } else if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters";
    return false;
  } else {
    passwordError.value = "";
    return true;
  }
};

const onLogin = async () => {
  // Validate inputs before submitting
  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  isLoading.value = true;

  try {
    const trimmedEmail = email.value.trim();
    const trimmedPassword = password.value.trim();

    // Corrected action name (fetchUser with capital 'U')
    const isLoggedIn = await store.dispatch("user/fetchUser", {
      email: trimmedEmail,
      password: trimmedPassword,
    });

    if (isLoggedIn) {
      router.push("/Home");
    } else {
      passwordError.value = "Incorrect email or password";
    }
  } catch (error) {
    console.error("Something went wrong:", error);
    passwordError.value =
      "Something went wrong during login. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

// Forgot password function
const onForgotPassword = () => {
  if (!email.value.trim()) {
    emailError.value = "Please enter your email first";
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Please enter a valid email address";
    return;
  }

  alert(`Password reset instructions sent to ${email.value}`);
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <form @submit.prevent="onLogin" class="login-form">
        <h2 class="login-title">Login</h2>

        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <el-input
            id="email"
            v-model="email"
            size="large"
            clearable
            placeholder="Enter your email"
            @blur="validateEmail"
            :class="{ error: emailError }"
          />
          <div v-if="emailError" class="error-message">{{ emailError }}</div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <el-input
            id="password"
            v-model="password"
            type="password"
            size="large"
            show-password
            placeholder="Enter your password"
            @blur="validatePassword"
            :class="{ error: passwordError }"
          />
          <div v-if="passwordError" class="error-message">
            {{ passwordError }}
          </div>
        </div>

        <div class="forgot-password">
          <button
            type="button"
            @click="onForgotPassword"
            class="forgot-password-link"
          >
            Forgot Password?
          </button>
        </div>

        <el-button
          type="primary"
          native-type="submit"
          class="login-btn"
          :loading="isLoading"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else>Logging in...</span>
        </el-button>
      </form>

      <div class="signup-link-container">
        <p class="signup-text">
          Don't have an account?
          <router-link to="/Signup" class="signup-link"
            >Signup here</router-link
          >
        </p>
      </div>
    </div>
  </div>
</template>
<style>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.login-card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  animation: fadeInUp 0.4s ease-out;
}

.login-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #003366;
  margin-bottom: 1rem;
  text-align: center;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

:deep(.el-input__wrapper) {
  height: 3rem;
  border-radius: 0.5rem;
  padding: 0 0.75rem;
  border: 1px solid #cdd9e5;
  transition: border-color 0.3s ease;
}

:deep(.el-input__wrapper:hover),
:deep(.el-input__wrapper.is-focus) {
  border-color: #007bff;
}

:deep(.el-input__inner) {
  font-size: 0.95rem;
}

.error-message {
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.3rem;
}

.forgot-password {
  text-align: right;
  margin-top: -0.5rem;
}

.forgot-password-link {
  background: none;
  border: none;
  color: #484a5a;
  text-decoration: underline;
  font-size: 0.85rem;
  cursor: pointer;
}
.forgot-password-link:hover {
  color: #989ec4;
}

.login-btn {
  background-color: #484a5a !important;
  color: #ffffff;
  font-weight: 600;
  width: 100%;
  height: 3rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  background-color: #989ec4 !important;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.signup-link-container {
  margin-top: 1.5rem;
  text-align: center;
}

.signup-text {
  font-size: 0.9rem;
  color: #333;
}

.signup-link {
  color: #484a5a;
  text-decoration: underline;
  font-weight: 500;
}

.signup-link:hover {
  color: #989ec4;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
