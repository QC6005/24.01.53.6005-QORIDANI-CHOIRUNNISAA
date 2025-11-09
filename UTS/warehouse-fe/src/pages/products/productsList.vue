<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-semibold">Products</h1>
      <button
        @click="openForm()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        + Add Product
      </button>
    </div>

    <div v-if="store.loading" class="text-gray-500">Loading...</div>

    <table v-else class="w-full border-collapse border border-slate-700">
      <thead class="bg-slate-800 text-white">
        <tr>
          <th class="p-2 border border-slate-700">ID</th>
          <th class="p-2 border border-slate-700">Name</th>
          <th class="p-2 border border-slate-700">SKU</th>
          <th class="p-2 border border-slate-700">Stock</th>
          <th class="p-2 border border-slate-700">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="p in store.products"
          :key="p.id"
          class="hover:bg-slate-700 text-center"
        >
          <td class="p-2 border border-slate-700">{{ p.id }}</td>
          <td class="p-2 border border-slate-700">{{ p.name }}</td>
          <td class="p-2 border border-slate-700">{{ p.sku }}</td>
          <td class="p-2 border border-slate-700">{{ p.stock }}</td>
          <td class="p-2 border border-slate-700">
            <button
              @click="openForm(p)"
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
            >
              Edit
            </button>
            <button
              @click="del(p.id)"
              class="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Form -->
    <ProductForm
      v-if="showForm"
      :editData="selected"
      @close="closeForm"
      @saved="onSaved"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useProductsStore } from "../../stores/products";
import ProductForm from "./ProductsForm.vue";

const store = useProductsStore();
const showForm = ref(false);
const selected = ref(null);

onMounted(() => store.fetchProducts());

function openForm(data = null) {
  selected.value = data;
  showForm.value = true;
}
function closeForm() {
  showForm.value = false;
  selected.value = null;
}
function onSaved() {
  store.fetchProducts();
  closeForm();
}
async function del(id) {
  if (confirm("Delete this product?")) {
    await store.deleteProduct(id);
  }
}
</script>
