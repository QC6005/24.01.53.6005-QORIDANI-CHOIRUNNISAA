<template>
  <div>
    <TableManager
      :title="'Shipments'"
      :columns="cols"
      :rows="shipments"
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
          {{ editing ? "Edit" : "Add" }} Shipment
        </h3>

        <form @submit.prevent="save">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm">Order</label>
              <select
                v-model="form.order_id"
                class="w-full border rounded px-3 py-2"
                required
              >
                <option
                  v-for="o in orders"
                  :key="o.id"
                  :value="o.id"
                >
                  Order #{{ o.id }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm">Warehouse</label>
              <select
                v-model="form.warehouse_id"
                class="w-full border rounded px-3 py-2"
              >
                <option
                  v-for="w in warehouses"
                  :key="w.id"
                  :value="w.id"
                >
                  {{ w.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm">Vehicle</label>
              <select
                v-model="form.vehicle_id"
                class="w-full border rounded px-3 py-2"
              >
                <option
                  v-for="v in vehicles"
                  :key="v.id"
                  :value="v.id"
                >
                  {{ v.plate_number }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm">Status</label>
              <select
                v-model="form.status"
                class="w-full border rounded px-3 py-2"
              >
                <option>Ready</option>
                <option>On Delivery</option>
                <option>Delivered</option>
                <option>Returned</option>
              </select>
            </div>

            <div class="col-span-2">
              <label class="block text-sm">Shipped Date</label>
              <input
                type="datetime-local"
                v-model="form.shipped_date"
                class="w-full border rounded px-3 py-2"
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
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../../services/api";
import TableManager from "../../components/TableManager.vue";

const shipments = ref([]);
const orders = ref([]);
const warehouses = ref([]);
const vehicles = ref([]);

const showModal = ref(false);
const editing = ref(false);

const form = ref({
  order_id: null,
  warehouse_id: null,
  vehicle_id: null,
  shipped_date: null,
  status: "Ready",
});

const cols = [
  { key: "id", label: "ID" },
  { key: "order_id", label: "Order ID" },
  { key: "warehouse_id", label: "Warehouse ID" },
  { key: "vehicle_id", label: "Vehicle ID" },
  { key: "status", label: "Status" },
  { key: "shipped_date", label: "Shipped Date" },
];

async function load() {
  const [s, o, w, v] = await Promise.all([
    api.get("/records/shipments"),
    api.get("/records/orders"),
    api.get("/records/warehouses"),
    api.get("/records/vehicles"),
  ]);

  shipments.value = s.data?.records || s.data;
  orders.value = o.data?.records || o.data;
  warehouses.value = w.data?.records || w.data;
  vehicles.value = v.data?.records || v.data;
}

function openCreate() {
  editing.value = false;
  form.value = {
    order_id: orders.value[0]?.id || null,
    warehouse_id: warehouses.value[0]?.id || null,
    vehicle_id: vehicles.value[0]?.id || null,
    shipped_date: null,
    status: "Ready",
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
      await api.put(`/records/shipments/${form.value.id}`, form.value);
    } else {
      await api.post("/records/shipments", form.value);
    }
    await load();
    closeModal();
  } catch (err) {
    console.error(err);
    alert("Error saving data!");
  }
}

async function confirmDelete(row) {
  if (confirm(`Delete shipment #${row.id}?`)) {
    try {
      await api.delete(`/records/shipments/${row.id}`);
      await load();
    } catch (err) {
      alert("Cannot delete shipment — it may be linked to other data.");
      console.error(err);
    }
  }
}

onMounted(load);
</script>
