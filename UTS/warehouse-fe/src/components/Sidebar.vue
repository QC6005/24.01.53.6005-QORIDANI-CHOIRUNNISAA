<template>
  <aside
    :class="[
      'h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col transition-all duration-300 shadow-xl',
      collapsed ? 'w-20' : 'w-64'
    ]"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4 border-b border-slate-700">
      <h1
        v-if="!collapsed"
        class="text-lg font-semibold tracking-wide transition-opacity duration-300"
      >
        Menu
      </h1>
      <button
        class="text-slate-400 hover:text-white transition"
        @click="collapsed = !collapsed"
      >
        <i :class="collapsed ? 'fas fa-angle-right' : 'fas fa-angle-left'"></i>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto mt-3">
      <ul class="space-y-1">
        <li
          v-for="item in menu"
          :key="item.path"
          @click="goTo(item.path)"
          :class="[
            'flex items-center cursor-pointer px-4 py-3 rounded-md mx-2 transition-all duration-200',
            isActive(item.path)
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:bg-slate-700 hover:text-white'
          ]"
        >
          <i :class="[getIcon(item.label), 'w-6 text-center text-lg']"></i>
          <span
            v-if="!collapsed"
            class="ml-3 text-sm font-medium transition-opacity duration-300"
          >
            {{ item.label }}
          </span>
        </li>
      </ul>
    </nav>

    <!-- Footer -->
    <div class="px-4 py-3 border-t border-slate-700 text-sm flex items-center justify-between">
      <div v-if="!collapsed" class="text-gray-400">v1.0.0</div>
      <button
        class="text-gray-400 hover:text-red-400 transition"
        @click="logout"
        title="Logout"
      >
        <i class="fas fa-sign-out-alt"></i>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const collapsed = ref(false)

// Menu berdasarkan role
const menu = computed(() => {
  const role_id = auth.user?.role_id || auth.user?.role || null
  const base = [{ path: '/app', label: 'Dashboard' }]
  if (role_id === 1)
    return base.concat([
      { path: '/app/products', label: 'Products' },
      { path: '/app/warehouses', label: 'Warehouses' },
      { path: '/app/inventory', label: 'Inventory' },
      { path: '/app/orders', label: 'Orders' },
      { path: '/app/shipments', label: 'Shipments' },
      { path: '/app/users', label: 'Users' },
      { path: '/app/roles', label: 'Roles' },
    ])
  if (role_id === 2)
    return base.concat([
      { path: '/app/products', label: 'Products' },
      { path: '/app/inventory', label: 'Inventory' },
      { path: '/app/orders', label: 'Orders' },
    ])
  if (role_id === 3)
    return base.concat([{ path: '/app/shipments', label: 'Shipments' }])
  return base
})

// Navigasi
function goTo(path) {
  router.push(path)
}

// Highlight aktif
function isActive(path) {
  return route.path === path
}

// Logout
function logout() {
  auth.logout()
  router.push('/login')
}

// Ikon otomatis berdasarkan nama menu
function getIcon(label) {
  const icons = {
    Dashboard: 'fas fa-home',
    Products: 'fas fa-boxes',
    Warehouses: 'fas fa-warehouse',
    Inventory: 'fas fa-cubes',
    Orders: 'fas fa-shopping-cart',
    Shipments: 'fas fa-truck',
    Users: 'fas fa-users',
    Roles: 'fas fa-user-shield',
  }
  return icons[label] || 'fas fa-circle'
}
</script>

<style scoped>
/* Scrollbar minimalis */
nav::-webkit-scrollbar {
  width: 6px;
}
nav::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}
nav::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Animasi collapse smooth */
aside {
  transition: width 0.3s ease;
}

/* Hover lembut */
li:hover {
  transform: translateX(3px);
  transition: all 0.2s ease;
}
</style>
