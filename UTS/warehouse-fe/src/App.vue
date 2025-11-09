<template>
  <div>
    <!-- Progress bar di atas -->
    <div
      v-if="loading"
      class="fixed top-0 left-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-progress"
    ></div>

    <!-- Route transitions -->
    <transition name="route-fade-slide" mode="out-in">
      <router-view @route-loading="setLoading" />
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const loading = ref(false)
const router = useRouter()

// Deteksi perubahan route untuk animasi progress bar
router.beforeEach((to, from, next) => {
  loading.value = true
  next()
})
router.afterEach(() => {
  setTimeout(() => (loading.value = false), 300)
})
</script>

<style scoped>
@keyframes progress {
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
}
.animate-progress {
  animation: progress 0.6s ease-in-out;
}

.route-fade-slide-enter-active,
.route-fade-slide-leave-active {
  transition: all 0.6s ease;
}
.route-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.route-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
