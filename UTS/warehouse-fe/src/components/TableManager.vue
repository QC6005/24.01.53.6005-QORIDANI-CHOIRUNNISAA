<template>
<div>
<div class="flex justify-between items-center mb-4">
<h3 class="text-lg font-semibold">{{ title }}</h3>
<div>
<button @click="$emit('create')" class="px-3 py-1 bg-green-600 text-white rounded">Add</button>
</div>
</div>


<div class="bg-white rounded shadow overflow-auto">
<table class="min-w-full">
<thead class="bg-gray-100">
<tr>
<th v-for="col in columns" :key="col.key" class="p-3 text-left">{{ col.label }}</th>
<th class="p-3">Actions</th>
</tr>
</thead>
<tbody>
<tr v-for="row in rows" :key="row.id" class="border-t">
<td v-for="col in columns" :key="col.key" class="p-3">{{ row[col.key] }}</td>
<td class="p-3">
<button @click="$emit('edit', row)" class="px-2 py-1 mr-2 border rounded">Edit</button>
<button @click="$emit('delete', row)" class="px-2 py-1 border rounded text-red-600">Delete</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</template>


<script setup>
defineProps({ title: String, columns: Array, rows: Array })
</script>