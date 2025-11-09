<template>
  <div>
    <TableManager
      :title="'Roles'"
      :columns="cols"
      :rows="roles"
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
          {{ editing ? "Edit" : "Add" }} Role
        </h3>

        <form @submit.prevent="save">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-sm">Role Name</label>
              <input
                type="text"
                v-model="form.name"
                class="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm">Description</label>
              <textarea
                v-model="form.description"
                class="w-full border rounded px-3 py-2"
                rows="3"
                placeholder="Describe this role..."
              ></textarea>
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

const roles = ref([]);
const showModal = ref(false);
const editing = ref(false);

const form = ref({
  name: "",
  description: "",
});

const cols = [
  { key: "id", label: "ID" },
  { key: "name", label: "Role Name" },
  { key: "description", label: "Description" },
  { key: "created_at", label: "Created At" },
];

async function load() {
  const res = await api.get("/records/roles");
  roles.value = res.data?.records || res.data;
}

function openCreate() {
  editing.value = false;
  form.value = {
    name: "",
    description: "",
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
      await api.put(`/records/roles/${form.value.id}`, form.value);
    } else {
      await api.post("/records/roles", form.value);
    }
    await load();
    closeModal();
  } catch (err) {
    if (err.response?.data?.message?.includes("name")) {
      alert("Role name must be unique!");
    } else {
      alert("Error saving role data.");
    }
    console.error(err);
  }
}

async function confirmDelete(row) {
  if (confirm(`Delete role '${row.name}'?`)) {
    try {
      await api.delete(`/records/roles/${row.id}`);
      await load();
    } catch (err) {
      alert("Cannot delete this role (maybe used by users).");
      console.error(err);
    }
  }
}

onMounted(load);
</script>
