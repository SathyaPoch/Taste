<template>
  <main>
    <section class="hero scene"><div class="hero-copy"><span class="eyebrow">GOOD FOOD, GROWN CLOSE</span><h1>Fresh from the farm.<br />Made for your table.</h1><p>Discover seasonal produce from Cambodian farmers and support a more connected food community.</p><RouterLink class="button-link" to="/crops">Explore the harvest <span aria-hidden="true">→</span></RouterLink></div><div class="hero-image" role="img" aria-label="Fresh produce at a local market"></div></section>
    <CropCatalog />
    <section class="join"><div><span class="eyebrow">GROW WITH TASTE</span><h2>Have a harvest to share?</h2></div><RouterLink class="button-link" to="/submit">List your produce <span aria-hidden="true">→</span></RouterLink></section>
  </main>
</template>
<script setup lang="ts">
import CropCatalog from '../components/CropCatalog.vue'
</script>
