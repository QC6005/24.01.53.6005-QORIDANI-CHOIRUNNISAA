<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
  >
    <div class="bg-white text-black p-6 rounded-lg w-[400px]">
      <h2 class="text-xl font-semibold mb-4">
        {{ editData ? "Edit Product" : "Add Product" }}
      </h2>

      <form @submit.prevent="save">
        <label class="block mb-2">Name</label>
        <input v-model="form.name" class="w-full border p-2 mb-3 rounded" required />

        <label class="block mb-2">SKU</label>
        <input v-model="form.sku" class="w-full border p-2 mb-3 rounded" required />

        <label class="block mb-2">Stock</label>
        <input v-model="form.stock" type="number" class="w-full border p-2 mb-3 rounded" required />

        <div class="flex justify-end mt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="mr-3 px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";
import { useProductsStore } from "../../stores/products";

const props = defineProps({ editData: Object });
const emit = defineEmits(["close", "saved"]);

const store = useProductsStore();
const form = reactive({
  name: "",
  sku: "",
  stock: 0,
});

watch(
  () => props.editData,
  (val) => {
    if (val) Object.assign(form, val);
    else Object.assign(form, { name: "", sku: "", stock: 0 });
  },
  { immediate: true }
);

async function save() {
  if (props.editData) await store.updateProduct(props.editData.id, form);
  else await store.addProduct(form);
  emit("saved");
}
</script>
