<template>
  <div>
    <TableManager
      :title="'Users'"
      :columns="cols"
      :rows="users"
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
          {{ editing ? "Edit" : "Add" }} User
        </h3>

        <form @submit.prevent="save">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm">Role</label>
              <select
                v-model="form.role_id"
                class="w-full border rounded px-3 py-2"
                required
              >
                <option v-for="r in roles" :key="r.id" :value="r.id">
                  {{ r.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="block text-sm">Full Name</label>
              <input
                type="text"
                v-model="form.full_name"
                class="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm">Username</label>
              <input
                type="text"
                v-model="form.username"
                class="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label class="block text-sm">Email</label>
              <input
                type="email"
                v-model="form.email"
                class="w-full border rounded px-3 py-2"
              />
            </div>

            <div class="col-span-2">
              <label class="block text-sm">Password</label>
              <input
                type="password"
                v-model="form.password"
                class="w-full border rounded px-3 py-2"
                :required="!editing"
                placeholder="••••••"
              />
            </div>

            <div class="col-span-2 flex items-center mt-2">
              <input
                type="checkbox"
                v-model="form.is_active"
                class="mr-2"
                true-value="1"
                false-value="0"
              />
              <label class="text-sm">Active</label>
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

const users = ref([]);
const roles = ref([]);
const showModal = ref(false);
const editing = ref(false);

const form = ref({
  role_id: null,
  full_name: "",
  username: "",
  email: "",
  password: "",
  is_active: 1,
});

const cols = [
  { key: "id", label: "ID" },
  { key: "role_id", label: "Role ID" },
  { key: "full_name", label: "Full Name" },
  { key: "username", label: "Username" },
  { key: "email", label: "Email" },
  { key: "is_active", label: "Active" },
  { key: "created_at", label: "Created At" },
];

async function load() {
  const res = await api.get("/records/users");
  users.value = res.data?.records || res.data;

  const r = await api.get("/records/roles");
  roles.value = r.data?.records || r.data;
}

function openCreate() {
  editing.value = false;
  form.value = {
    role_id: roles.value[0]?.id || null,
    full_name: "",
    username: "",
    email: "",
    password: "",
    is_active: 1,
  };
  showModal.value = true;
}

function openEdit(row) {
  editing.value = true;
  form.value = { ...row, password: "" }; // kosongkan password saat edit
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function save() {
  try {
    if (editing.value) {
      // jangan kirim password jika kosong
      const payload = { ...form.value };
      if (!payload.password) delete payload.password;
      await api.put(`/records/users/${form.value.id}`, payload);
    } else {
      await api.post("/records/users", form.value);
    }
    await load();
    closeModal();
  } catch (err) {
    if (err.response?.data?.message?.includes("username")) {
      alert("Username already exists!");
    } else {
      alert("Error saving user data.");
    }
    console.error(err);
  }
}

async function confirmDelete(row) {
  if (confirm(`Delete user '${row.username}'?`)) {
    try {
      await api.delete(`/records/users/${row.id}`);
      await load();
    } catch (err) {
      alert("Cannot delete this user (maybe linked to other data).");
      console.error(err);
    }
  }
}

onMounted(load);
</script>
