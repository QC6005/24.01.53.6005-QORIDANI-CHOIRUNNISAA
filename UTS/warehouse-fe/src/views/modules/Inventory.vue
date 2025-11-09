<template>
    <transition name="fade-in">
          <div>
    <TableManager
      :title="'Inventory'"
      :columns="cols"
      :rows="inventory"
      @create="openCreate"
      @edit="openEdit"
      @delete="confirmDelete"
    />

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center"
    >
      <div class="bg-white rounded shadow p-6 w-3/5">
        <h3 class="text-xl font-semibold mb-4">
          {{ editing ? "Edit" : "Add" }} Inventory
        </h3>

        <form @submit.prevent="save">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm">Warehouse</label>
              <select
                v-model="form.warehouse_id"
                class="w-full border rounded px-3 py-2"
                required
              >
                <option v-for="w in warehouses" :key="w.id" :value="w.id">
                  {{ w.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm">Product</label>
              <select
                v-model="form.product_id"
                class="w-full border rounded px-3 py-2"
                required
              >
                <option v-for="p in products" :key="p.id" :value="p.id">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div class="col-span-2">
              <label class="block text-sm">Quantity</label>
              <input
                type="number"
                v-model.number="form.quantity"
                min="0"
                class="w-full border rounded px-3 py-2"
                required
              />
            </div>
          </div>

          <div class="mt-4 flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="px-3 py-1 mr-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
    </transition>

</template>

<style scoped>
.fade-in-enter-active {
  transition: all 0.6s ease;
}
.fade-in-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
</style>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import TableManager from "../../components/TableManager.vue";

const inventory = ref([]);
const warehouses = ref([]);
const products = ref([]);
const showModal = ref(false);
const editing = ref(false);

const form = ref({
  warehouse_id: null,
  product_id: null,
  quantity: 0,
});

const cols = [
  { key: "id", label: "ID" },
  { key: "warehouse_id", label: "Warehouse ID" },
  { key: "product_id", label: "Product ID" },
  { key: "quantity", label: "Quantity" },
  { key: "last_updated", label: "Last Updated" },
];

async function load() {
  const inv = await api.get("/records/inventory");
  inventory.value = inv.data?.records || inv.data;

  const w = await api.get("/records/warehouses");
  warehouses.value = w.data?.records || w.data;

  const p = await api.get("/records/products");
  products.value = p.data?.records || p.data;
}

function openCreate() {
  editing.value = false;
  form.value = {
    warehouse_id: warehouses.value[0]?.id || null,
    product_id: products.value[0]?.id || null,
    quantity: 0,
  };
  showModal.value = true;
}

function openEdit(row) {
  editing.value = true;
  form.value = { ...row };
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function save() {
  try {
    if (editing.value) {
      await api.put(`/records/inventory/${form.value.id}`, form.value);
    } else {
      await api.post("/records/inventory", form.value);
    }
    await load();
    closeModal();
  } catch (err) {
    if (err.response?.data?.message?.includes("uq_wh_prod")) {
      alert("This product already exists in the selected warehouse!");
    } else {
      alert("Error saving data.");
    }
    console.error(err);
  }
}

async function confirmDelete(row) {
  if (confirm(`Delete inventory record #${row.id}?`)) {
    try {
      await api.delete(`/records/inventory/${row.id}`);
      await load();
    } catch (err) {
      alert("Cannot delete this record because it’s linked to other data.");
      console.error(err);
    }
  }
}

onMounted(load);
</script>
