<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import bcrypt from "bcryptjs";

const email = ref("");
const password = ref("");
const firstName = ref("");
const lastName = ref("");
const repassword = ref("");
const router = useRouter();
const store = useStore();
const isLoading = ref(false);

// Validation error states
const emailError = ref("");
const firstNameError = ref("");
const lastNameError = ref("");
const passwordError = ref("");
const repasswordError = ref("");

// Password requirements visibility
const showPasswordRequirements = ref(false);

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

const validateFirstName = () => {
  if (!firstName.value.trim()) {
    firstNameError.value = "First name is required";
    return false;
  } else if (firstName.value.length < 2) {
    firstNameError.value = "First name must be at least 2 characters";
    return false;
  } else {
    firstNameError.value = "";
    return true;
  }
};

const validateLastName = () => {
  if (!lastName.value.trim()) {
    lastNameError.value = "Last name is required";
    return false;
  } else if (lastName.value.length < 2) {
    lastNameError.value = "Last name must be at least 2 characters";
    return false;
  } else {
    lastNameError.value = "";
    return true;
  }
};

const validatePassword = () => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password.value.trim()) {
    passwordError.value = "Password is required";
    return false;
  } else if (!passwordRegex.test(password.value)) {
    passwordError.value = "Password does not meet requirements";
    return false;
  } else {
    passwordError.value = "";
    return true;
  }
};

const validateRepassword = () => {
  if (!repassword.value.trim()) {
    repasswordError.value = "Please confirm your password";
    return false;
  } else if (password.value !== repassword.value) {
    repasswordError.value = "Passwords do not match";
    return false;
  } else {
    repasswordError.value = "";
    return true;
  }
};

const onSignup = async () => {
  // Validate all fields before submitting
  const isEmailValid = validateEmail();
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isPasswordValid = validatePassword();
  const isRepasswordValid = validateRepassword();

  if (
    !isEmailValid ||
    !isFirstNameValid ||
    !isLastNameValid ||
    !isPasswordValid ||
    !isRepasswordValid
  ) {
    return;
  }

  isLoading.value = true;

  try {
    const trimmedEmail = email.value.trim();
    const trimmedFirstName = firstName.value.trim();
    const trimmedLastName = lastName.value.trim();
    const trimmedPassword = password.value.trim();
    const trimmedRePassword = repassword.value.trim();

   

    const success = await store.dispatch("user/signup", {
      email: trimmedEmail,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      password: trimmedPassword,
    });

    if (success === true) {
      localStorage.setItem("isNewUser", "true");
      alert("Signup successful! Please log in.");
      router.push("/Login");
    } else if (success === "Email already exists") {
      emailError.value = "Email already exists. Please use a different email.";
    } else {
      alert("Signup failed. Please try again.");
    }
  } catch (error) {
    console.error("Error during signup:", error);
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      alert(
        "Network error: Could not connect to the server. Please ensure the backend is running."
      );
    } else if (error instanceof SyntaxError && error.message.includes("JSON")) {
      alert(
        "Server returned invalid data. Please check the server response in the browser's network tab."
      );
    } else {
      alert("Something went wrong during signup. Please try again.");
    }
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="signup-container">
    <div class="signup-card">
      <form @submit.prevent="onSignup" class="signup-form">
        <h2 class="signup-title">Sign Up</h2>

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
          <label for="firstName" class="form-label">First Name</label>
          <el-input
            id="firstName"
            v-model="firstName"
            size="large"
            clearable
            placeholder="Enter your first name"
            @blur="validateFirstName"
            :class="{ error: firstNameError }"
          />
          <div v-if="firstNameError" class="error-message">
            {{ firstNameError }}
          </div>
        </div>

        <div class="form-group">
          <label for="lastName" class="form-label">Last Name</label>
          <el-input
            id="lastName"
            v-model="lastName"
            size="large"
            clearable
            placeholder="Enter your last name"
            @blur="validateLastName"
            :class="{ error: lastNameError }"
          />
          <div v-if="lastNameError" class="error-message">
            {{ lastNameError }}
          </div>
        </div>

        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <el-input
            id="password"
            v-model="password"
            type="password"
            size="large"
            show-password
            placeholder="Create a password"
            @focus="showPasswordRequirements = true"
            @blur="
              () => {
                validatePassword();
                showPasswordRequirements = false;
              }
            "
            :class="{ error: passwordError }"
          />
          <div v-if="passwordError" class="error-message">
            {{ passwordError }}
          </div>

          <!-- Password requirements -->
          <div v-if="showPasswordRequirements" class="password-requirements">
            <p class="requirements-title">Password must contain:</p>
            <ul class="requirements-list">
              <li :class="{ valid: password.length >= 8 }">
                At least 8 characters
              </li>
              <li :class="{ valid: /[a-z]/.test(password) }">
                At least one lowercase letter
              </li>
              <li :class="{ valid: /[A-Z]/.test(password) }">
                At least one uppercase letter
              </li>
              <li :class="{ valid: /\d/.test(password) }">
                At least one number
              </li>
              <li :class="{ valid: /[\W_]/.test(password) }">
                At least one special character
              </li>
            </ul>
          </div>
        </div>

        <div class="form-group">
          <label for="repassword" class="form-label">Confirm Password</label>
          <el-input
            id="repassword"
            v-model="repassword"
            type="password"
            size="large"
            show-password
            placeholder="Confirm your password"
            @blur="validateRepassword"
            :class="{ error: repasswordError }"
          />
          <div v-if="repasswordError" class="error-message">
            {{ repasswordError }}
          </div>
        </div>

        <el-button
          type="primary"
          native-type="submit"
          class="signup-btn"
          :loading="isLoading"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Sign Up</span>
          <span v-else>Signing up...</span>
        </el-button>
      </form>

      <div class="login-link-container">
        <p class="login-text">
          Already have an account?
          <router-link to="/Login" class="login-link">Login here</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.signup-card {
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

.signup-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: #003366;
  margin-bottom: 1rem;
  text-align: center;
}

.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.4rem;
  font-size: 0.95rem;
}

:deep(.el-input__wrapper) {
  height: 2.8rem;
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

.password-requirements {
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border-left: 3px solid #007bff;
}

.requirements-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
}

.requirements-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.requirements-list li {
  color: #6c757d;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
}

.requirements-list li.valid {
  color: #28a745;
}

.requirements-list li::before {
  content: "✗";
  color: #e74c3c;
  margin-right: 0.5rem;
  font-weight: bold;
}

.requirements-list li.valid::before {
  content: "✓";
  color: #28a745;
}

.signup-btn {
  background-color: #484a5a !important;
  color: #ffffff;
  font-weight: 600;
  width: 100%;
  height: 2.8rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.signup-btn:hover:not(:disabled) {
  background-color: #989ec4 !important;
}

.signup-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-link-container {
  margin-top: 1.5rem;
  text-align: center;
}

.login-text {
  font-size: 0.9rem;
  color: #333;
}

.login-link {
  color: #484a5a;
  text-decoration: underline;
  font-weight: 500;
}

.login-link:hover {
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

/* Responsive styles */
@media (max-width: 480px) {
  .signup-card {
    padding: 1rem;
    margin: 0 1rem;
  }

  .signup-title {
    font-size: 1.4rem;
  }

  :deep(.el-input__wrapper) {
    height: 2.5rem;
  }
}
</style>
