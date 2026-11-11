<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCropsStore } from '../stores/crops'

const store = useCropsStore()
const query = ref('')
const visibleCrops = computed(() => store.items.filter((crop) => crop.name.toLowerCase().includes(query.value.toLowerCase())))
onMounted(() => store.load())
</script>

<template>
  <section class="catalog">
    <div class="catalog-heading"><div><span class="eyebrow">FRESH FROM LOCAL FARMS</span><h1>Popular this week</h1></div><input v-model="query" aria-label="Search crops" placeholder="Search crops" /></div>
    <p v-if="store.loading" role="status" class="state">Loading fresh listings…</p>
    <div v-else-if="store.error" role="alert" class="state error">{{ store.error }} <button @click="store.loaded = false; store.load()">Try again</button></div>
    <p v-else-if="visibleCrops.length === 0" class="state">No crops match your search. Try another name.</p>
    <div v-else class="product-grid">
      <article v-for="crop in visibleCrops" :key="crop.id" class="product-card">
        <RouterLink :to="{ name: 'crop-detail', params: { id: crop.id } }"><img :src="crop.image" :alt="crop.name" /></RouterLink>
        <div class="product-title"><span>{{ crop.name }}</span><span>${{ crop.price.toFixed(2) }}/{{ crop.unit }}</span></div>
        <div class="product-meta"><span>{{ crop.location }}</span><span>{{ crop.quantity }} kg available</span></div>
        <RouterLink class="buy" :to="{ name: 'crop-detail', params: { id: crop.id } }">View details</RouterLink>
      </article>
    </div>
  </section>
</template>
