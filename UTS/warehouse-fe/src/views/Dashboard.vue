<template>
  <div class="app-shell flex min-h-screen bg-slate-50">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <Navbar />

      <!-- Konten utama -->
      <div class="p-6 flex-1 overflow-auto">
        <transition name="fade-slide" mode="out-in">
          <router-view v-slot="{ Component }">
            <component :is="Component" v-if="Component" />
            <template v-else>
              <div>
                <h1 class="text-3xl font-semibold text-slate-800 mb-6">
                  Dashboard Overview
                </h1>

                <!-- Cards Statistik -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div
                    v-for="(item, index) in statCards"
                    :key="index"
                    class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
                  >
                    <div class="flex items-center justify-between mb-3">
                      <div class="text-sm text-slate-500 font-medium">
                        {{ item.label }}
                      </div>
                      <div
                        class="p-2 rounded-full bg-blue-50 text-blue-600 text-xl"
                      >
                        <component :is="item.icon" />
                      </div>
                    </div>
                    <div class="text-3xl font-semibold text-slate-800">
                      {{ item.value }}
                    </div>
                  </div>
                </div>

                <!-- Recent Orders -->
                <div
                  class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
                >
                  <h2 class="text-lg font-semibold text-slate-800 mb-4">
                    Recent Orders
                  </h2>
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="text-slate-500 text-sm border-b">
                        <th class="py-2">Order ID</th>
                        <th class="py-2">Customer</th>
                        <th class="py-2">Status</th>
                        <th class="py-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="o in orders"
                        :key="o.id"
                        class="border-b last:border-0 hover:bg-slate-50 transition"
                      >
                        <td class="py-2">{{ o.id }}</td>
                        <td class="py-2">{{ o.customer_id }}</td>
                        <td class="py-2">
                          <span
                            class="px-2 py-1 text-xs font-medium rounded-full"
                            :class="statusColor(o.status)"
                          >
                            {{ o.status }}
                          </span>
                        </td>
                        <td class="py-2 text-right font-medium">
                          ${{ o.total_amount }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </template>
          </router-view>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from "../services/api";
import { ref, onMounted, computed } from "vue";
import { Package, Warehouse, ClipboardList } from "lucide-vue-next";

const stats = ref({ products: 0, warehouses: 0, orders: 0 });
const orders = ref([]);

async function loadStats() {
  try {
    const [p, w, o] = await Promise.all([
      api.get("/records/products"),
      api.get("/records/warehouses"),
      api.get("/records/orders"),
    ]);

    stats.value.products = p.data?.records?.length || p.data?.length || 0;
    stats.value.warehouses = w.data?.records?.length || w.data?.length || 0;
    stats.value.orders = o.data?.records?.length || o.data?.length || 0;
    orders.value = o.data?.records?.slice(0, 5) || o.data?.slice(0, 5) || [];
  } catch (err) {
    console.error(err);
  }
}

const statCards = computed(() => [
  { label: "Total Products", value: stats.value.products, icon: Package },
  { label: "Total Warehouses", value: stats.value.warehouses, icon: Warehouse },
  { label: "Total Orders", value: stats.value.orders, icon: ClipboardList },
]);

function statusColor(status) {
  switch (status?.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

onMounted(loadStats);
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
