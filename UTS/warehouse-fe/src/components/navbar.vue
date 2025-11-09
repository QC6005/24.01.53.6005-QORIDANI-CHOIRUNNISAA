<template>
  <header
    class="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm flex items-center justify-between px-6 py-3 transition-all duration-300"
  >
    <!-- Brand -->
    <div class="flex items-center space-x-2">
      <i class="fas fa-warehouse text-blue-600 text-xl"></i>
      <h1 class="text-lg font-semibold tracking-wide text-slate-800">
        Warehouse WMS
      </h1>
    </div>

    <!-- Right Section -->
    <div class="relative">
      <!-- Profile Button -->
      <button
        @click="toggleMenu"
        class="flex items-center space-x-3 focus:outline-none hover:bg-slate-100 px-3 py-2 rounded-md transition"
      >
        <div
          class="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold"
        >
          {{ initials }}
        </div>
        <span class="hidden sm:block text-sm font-medium text-slate-700">
          {{ auth.user?.full_name || "User" }}
        </span>
        <i
          :class="[
            'fas text-slate-500 transition-transform duration-300',
            showMenu ? 'fa-chevron-up' : 'fa-chevron-down',
          ]"
        ></i>
      </button>

      <!-- Dropdown -->
      <transition name="fade">
        <div
          v-if="showMenu"
          class="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-50"
        >
          <div class="px-4 py-2 text-sm text-gray-600 border-b">
            <div class="font-medium text-slate-800">
              {{ auth.user?.full_name }}
            </div>
            <div class="text-xs text-slate-500">
              {{ getRoleName(auth.user?.role_id) }}
            </div>
          </div>

          <button
            @click="logout"
            class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
          >
            <i class="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </transition>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { onClickOutside } from "@vueuse/core";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const auth = useAuthStore();
const router = useRouter();
const showMenu = ref(false);
const menuRef = ref(null);

function toggleMenu() {
  showMenu.value = !showMenu.value;
}

function logout() {
  auth.logout();
  router.push("/login");
}

function getRoleName(role_id) {
  const roles = {
    1: "Admin",
    2: "Warehouse Staff",
    3: "Driver",
  };
  return roles[role_id] || "User";
}

// Tutup dropdown kalau klik di luar
onClickOutside(menuRef, () => (showMenu.value = false));

// Inisial huruf depan nama user
const initials = computed(() => {
  const name = auth.user?.full_name || "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
