<template>
  <div class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background Gradient Animated -->
    <div class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>

    <!-- Particles / Light Blur Orbs -->
    <div class="absolute w-64 h-64 bg-white/10 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
    <div class="absolute w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl bottom-10 right-10 animate-bounce-slow"></div>

    <!-- Card -->
    <transition name="fade-slide">
      <div
        class="relative z-10 w-full max-w-md bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-white/40 transform transition-all duration-700 hover:scale-[1.03]"
      >
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-2">
          Warehouse Management
        </h2>
        <p class="text-center text-gray-500 mb-8">Login to continue</p>

        <form @submit.prevent="doLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              v-model="username"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition placeholder-gray-400"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              v-model="password"
              class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition placeholder-gray-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            class="relative w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-pink-500 text-white font-semibold rounded-lg transition duration-300 shadow-lg flex items-center justify-center"
          >
            <svg
              v-if="loading"
              class="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            {{ loading ? 'Signing in...' : 'Login' }}
            <span
              class="absolute inset-0 rounded-lg ring-2 ring-transparent hover:ring-indigo-300 transition"
            ></span>
          </button>

          <p v-if="error" class="text-center text-red-600 mt-3 animate-pulse">
            {{ error }}
          </p>
        </form>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showCard = ref(false)

const router = useRouter()
const auth = useAuthStore()

onMounted(() => {
  // Fade-in effect saat pertama kali tampil
  setTimeout(() => (showCard.value = true), 300)
})

async function doLogin() {
  error.value = ''
  loading.value = true
  const res = await auth.login(username.value.trim(), password.value.trim())
  loading.value = false

  if (res.ok) {
    router.push('/app')
  } else {
    error.value = res.message || 'Login failed'
  }
}
</script>

<style scoped>
/* Gradient Animation */
@keyframes gradient-x {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 10s ease infinite;
}

/* Custom slow bounce */
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 6s infinite ease-in-out;
}

/* Fade + Slide Animation for card */
.fade-slide-enter-active {
  transition: all 0.8s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
