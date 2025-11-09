<template>
  <div>
    <TableManager
      :title="'Orders'"
      :columns="cols"
      :rows="orders"
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
          {{ editing ? "Edit" : "Add" }} Order
        </h3>

        <form @submit.prevent="save">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm">Customer</label>
              <select
                v-model="form.customer_id"
                class="w-full border rounded px-3 py-2"
                required
              >
                <option
                  v-for="c in customers"
                  :key="c.id"
                  :value="c.id"
                >
                  {{ c.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm">Status</label>
              <select
                v-model="form.status"
                class="w-full border rounded px-3 py-2"
              >
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
                <option>Cancelled</option>
              </select>
            </div>

            <div class="col-span-2">
              <label class="block text-sm">Total Amount</label>
              <input
                type="number"
                step="0.01"
                v-model.number="form.total_amount"
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

const orders = ref([]);
const customers = ref([]);
const showModal = ref(false);
const editing = ref(false);

const form = ref({
  customer_id: null,
  status: "Pending",
  total_amount: 0.0,
});

const cols = [
  { key: "id", label: "ID" },
  { key: "customer_id", label: "Customer ID" },
  { key: "status", label: "Status" },
  { key: "total_amount", label: "Total" },
  { key: "order_date", label: "Order Date" },
];

async function load() {
  const r1 = await api.get("/records/orders");
  orders.value = r1.data?.records || r1.data;

  const r2 = await api.get("/records/customers");
  customers.value = r2.data?.records || r2.data;
}

function openCreate() {
  editing.value = false;
  form.value = {
    customer_id: customers.value[0]?.id || null,
    status: "Pending",
    total_amount: 0.0,
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
      await api.put(`/records/orders/${form.value.id}`, form.value);
    } else {
      await api.post("/records/orders", form.value);
    }
    await load();
    closeModal();
  } catch (err) {
    console.error(err);
    alert("Error saving data!");
  }
}

async function confirmDelete(row) {
  if (confirm(`Delete order #${row.id}?`)) {
    try {
      await api.delete(`/records/orders/${row.id}`);
      await load();
    } catch (err) {
      alert("Cannot delete order — it may be linked to other data.");
      console.error(err);
    }
  }
}

onMounted(load);
</script>
