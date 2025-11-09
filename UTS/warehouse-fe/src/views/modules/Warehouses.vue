<template>
  <div>
    <TableManager
      :title="'Warehouses'"
      :columns="cols"
      :rows="warehouses"
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
          {{ editing ? "Edit" : "Add" }} Warehouse
        </h3>

        <form @submit.prevent="save">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm">Name</label>
              <input
                v-model="form.name"
                class="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm">Location</label>
              <input
                v-model="form.location"
                class="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label class="block text-sm">Manager</label>
              <select
                v-model="form.manager_id"
                class="w-full border rounded px-3 py-2"
              >
                <option v-for="u in users" :key="u.id" :value="u.id">
                  {{ u.username }}
                </option>
              </select>
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

const warehouses = ref([]);
const users = ref([]);
const showModal = ref(false);
const editing = ref(false);

const form = ref({
  name: "",
  location: "",
  manager_id: null,
});

const cols = [
  { key: "id", label: "ID" },
  { key: "name", label: "Name" },
  { key: "location", label: "Location" },
  { key: "manager_id", label: "Manager ID" },
];

async function load() {
  const w = await api.get("/records/warehouses");
  warehouses.value = w.data?.records || w.data;

  const u = await api.get("/records/users");
  users.value = u.data?.records || u.data;
}

function openCreate() {
  editing.value = false;
  form.value = {
    name: "",
    location: "",
    manager_id: users.value[0]?.id || null,
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
  if (editing.value) {
    await api.put(`/records/warehouses/${form.value.id}`, form.value);
  } else {
    await api.post("/records/warehouses", form.value);
  }
  await load();
  closeModal();
}

async function confirmDelete(row) {
  if (confirm(`Delete warehouse #${row.id}?`)) {
    try {
      await api.delete(`/records/warehouses/${row.id}`);
      await load();
    } catch (err) {
      alert("Cannot delete warehouse because it’s referenced by other data.");
      console.error(err);
    }
  }
}

onMounted(load);
</script>
