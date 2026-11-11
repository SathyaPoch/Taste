<script setup lang="ts">
import { computed } from 'vue'
import { RouterView, useRoute } from 'vue-router'

const route = useRoute()
const hideGlobalShell = computed(() => route.path.startsWith('/crops/') || ['/browse', '/messages', '/history', '/saved', '/farmer-verification', '/farmer-portal', '/submit', '/admin', '/account'].includes(route.path))
</script>

<template>
  <header class="site-header" v-if="!hideGlobalShell"><RouterLink class="wordmark" to="/">Taste</RouterLink><nav aria-label="Main navigation"><RouterLink to="/crops">Browse crops</RouterLink><RouterLink to="/about">Our story</RouterLink><RouterLink class="nav-cta" to="/submit">List produce</RouterLink></nav></header>
  <RouterView />
  <footer class="site-footer" v-if="!hideGlobalShell"><span>TASTE · GOOD FOOD, GROWN CLOSE</span><RouterLink to="/about">About Taste</RouterLink></footer>
</template>
