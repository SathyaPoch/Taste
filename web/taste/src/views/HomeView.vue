<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
const isDark = ref(localStorage.getItem('taste-theme') === 'dark')
function toggleTheme() {
  isDark.value = !isDark.value
  localStorage.setItem('taste-theme', isDark.value ? 'dark' : 'light')
}
const items = [
  {
    name: 'Mango',
    image: '/images/mango.jpg',
    alt: 'Fresh mango',
  },
  {
    name: 'Kiwi',
    image: '/images/kiwi.jpg',
    alt: 'Fresh kiwi fruit',
  },
  {
    name: 'Avocado',
    image: '/images/avocado.jpg',
    alt: 'Fresh avocado',
  },
]
const saved = ref<number[]>([])
function bookmark(index: number) {
  saved.value = saved.value.includes(index)
    ? saved.value.filter((i) => i !== index)
    : [...saved.value, index]
}
</script>
<template>
  <main class="reference-home" :class="{ 'dark-mode': isDark }">
    <section id="landing" class="ref-landing">
      <header class="ref-nav">
        <a class="ref-logo" href="#landing">Taste</a
        ><label class="ref-search">⌕ <input placeholder="Search for your products" /></label
        ><RouterLink class="ref-login" to="/login">Log in</RouterLink><button class="ref-theme-toggle" type="button" aria-label="Toggle bright and dark mode" :title="isDark ? 'Switch to bright mode' : 'Switch to dark mode'" @click="toggleTheme"><FontAwesomeIcon :icon="isDark ? faSun : faMoon" /></button><a href="#ending">Contact Support</a>
      </header>
      <div class="ref-hero-image" aria-label="A crate of fresh fruit"></div>
      <div class="ref-intro">
        <h1>Quality You Can Taste, Convenience You Deserve</h1>
        <p>
          Stop settling for wilted supermarket greens. We hand-select our fruits and vegetables
          daily, guaranteeing peak ripeness and flavor. Get restaurant-quality ingredients without
          the trip to the store.
        </p>
      </div>
    </section>
    <section id="demo-products" class="ref-products">
      <div class="ref-heading">
        <span>Latest</span>
        <h2>Popular This Week</h2>
      </div>
      <div class="ref-grid">
        <article v-for="(item, index) in items" :key="item.alt" class="ref-card">
          <img :src="item.image" :alt="item.alt" />
          <div class="ref-product-title"><span>{{ item.name }}</span><span>$3.00/KG</span></div>
          <div class="ref-meta">
            <span>Location : Phnom Penh • Cambodia</span><span>Available : 20 KG</span>
          </div>
          <div class="ref-meta ref-farmer">
            <span>John (Farmer) &nbsp;|&nbsp; ID : 22ddd1kd</span><span>Status : In Stock</span>
          </div>
          <div class="ref-actions">
            <button
              class="ref-bookmark"
              :class="{ saved: saved.includes(index) }"
              aria-label="Toggle bookmark"
              @click="bookmark(index)"
            ></button
            ><button class="ref-buy">Buy (Sign In is Required)</button>
          </div>
        </article>
      </div>
      <RouterLink class="ref-register" to="/farmer-verification">Register to be a certified farmer <span>➜</span></RouterLink>
    </section>
    <footer id="ending" class="ref-ending">
      <div class="ref-quote">“ORGANIC<br />EVERYDAY”</div>
      <div class="ref-footer-info">
        <div>
          <h3>Explore</h3>
          <a href="#demo-products">Crop listings</a>
        </div>
        <div>
          <h3>Contact Us</h3>
          <p><svg class="footer-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="m4 7 8 6 8-6"/></svg>info@taste.com</p>
          <p><svg class="footer-icon filled-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 2.8 9.4 2a1.5 1.5 0 0 1 1.8.9l1.2 3.2a1.5 1.5 0 0 1-.4 1.7l-1.8 1.5a14 14 0 0 0 4.5 4.5l1.5-1.8a1.5 1.5 0 0 1 1.7-.4l3.2 1.2a1.5 1.5 0 0 1 .9 1.8l-.8 2.8a2.5 2.5 0 0 1-2.4 1.8A16.8 16.8 0 0 1 3 5.2a2.5 2.5 0 0 1 1.8-2.4Z"/></svg>+855 12 123 456</p>
          <p><svg class="footer-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5 8 3l8 2 5-2v16l-5 2-8-2-5 2Z"/><path d="M8 3v16m8-14v16"/><path d="M14 9a2.4 2.4 0 1 1 4.8 0c0 2-2.4 4.3-2.4 4.3S14 11 14 9Z"/></svg>Phnom Penh, Cambodia</p>
        </div>
        <RouterLink class="ref-signup" to="/signup">SIGN UP</RouterLink>
      </div>
      <div class="ref-brand">TASTE</div>
      <div class="ref-legal"><span>Poch Sathya &nbsp; &#169; &nbsp; Term of Use &nbsp; &#8226; &nbsp; Privacy Policy</span><span class="social-links" aria-label="Social links"><a href="https://github.com/SathyaPoch" aria-label="GitHub profile"><img src="/images/github.png" alt="GitHub" /></a><a href="https://www.linkedin.com/in/sathya-poch-a01b0b271" aria-label="LinkedIn profile"><img src="/images/linkedin.png" alt="LinkedIn" /></a><a href="mailto:asksathyapoch@gmail.com" aria-label="Email Sathya Poch"><img src="/images/gmail.png" alt="Gmail" /></a></span></div>
    </footer>
  </main>
</template>
