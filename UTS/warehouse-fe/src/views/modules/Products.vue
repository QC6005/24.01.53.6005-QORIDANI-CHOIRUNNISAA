<template>
<div>
<TableManager :title="'Products'" :columns="cols" :rows="products" @create="openCreate" @edit="openEdit" @delete="confirmDelete" />


<!-- Modal -->
<div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center">
<div class="bg-white rounded shadow p-6 w-3/5">
<h3 class="text-xl font-semibold mb-4">{{ editing ? 'Edit' : 'Add' }} Product</h3>
<form @submit.prevent="save">
<div class="grid grid-cols-2 gap-4">
<div>
<label class="block text-sm">SKU</label>
<input v-model="form.sku" class="w-full border rounded px-3 py-2" />
</div>
<div>
<label class="block text-sm">Name</label>
<input v-model="form.name" class="w-full border rounded px-3 py-2" />
</div>
<div>
<label class="block text-sm">Supplier</label>
<select v-model="form.supplier_id" class="w-full border rounded px-3 py-2">
<option v-for="s in suppliers" :value="s.id" :key="s.id">{{ s.name }}</option>
</select>
</div>
<div>
<label class="block text-sm">Unit Price</label>
<input type="number" v-model.number="form.unit_price" class="w-full border rounded px-3 py-2" />
</div>
<div class="col-span-2">
<label class="block text-sm">Description</label>
<textarea v-model="form.description" class="w-full border rounded px-3 py-2" rows="3"></textarea>
</div>
</div>
<div class="mt-4 flex justify-end">
<button type="button" @click="closeModal" class="px-3 py-1 mr-2">Cancel</button>
<button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
</div>
</form>
</div>
</div>


</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import TableManager from '../../components/TableManager.vue'


const products = ref([])
const suppliers = ref([])
const showModal = ref(false)
const editing = ref(false)
const form = ref({ supplier_id: null, sku: '', name: '', description: '', unit_price: 0 })


const cols = [
{ key: 'id', label: 'ID' },
{ key: 'sku', label: 'SKU' },
{ key: 'name', label: 'Name' },
{ key: 'unit_price', label: 'Price' }
]


async function load() {
const r = await api.get('/records/products')
products.value = r.data && r.data.records ? r.data.records : r.data
const s = await api.get('/records/suppliers')
suppliers.value = s.data && s.data.records ? s.data.records : s.data
}


function openCreate() {
editing.value = false
form.value = { supplier_id: suppliers.value[0]?.id || null, sku: '', name: '', description: '', unit_price: 0 }
showModal.value = true
}


function openEdit(row) {
editing.value = true
form.value = { ...row }
showModal.value = true
}


function closeModal() { showModal.value = false }


async function save() {
if (editing.value) {
await api.put(`/records/products/${form.value.id}`, form.value)
} else {
await api.post('/records/products', form.value)
}
await load()
closeModal()
}


async function confirmDelete(row) {
  if (confirm(`Delete product #${row.id}?`)) {
    try {
      await api.delete(`/records/products/${row.id}`)
      await load()
    } catch (err) {
      console.error(err)
      if (err.response?.data?.code === 1010) {
        alert('Produk ini tidak bisa dihapus karena masih digunakan di data lain (misalnya order atau stok).')
      } else {
        alert('Terjadi kesalahan saat menghapus produk.')
      }
    }
  }
}


onMounted(load)
</script>