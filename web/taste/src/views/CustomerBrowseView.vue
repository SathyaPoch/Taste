<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faList, faMessage, faClockRotateLeft, faBookmark, faMagnifyingGlass, faSliders, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import { getProfileAvatar } from '../services/profileAvatar'

const router = useRouter()
const avatarUrl = getProfileAvatar()
const signedInUser = JSON.parse(localStorage.getItem('taste-user') ?? '{}') as { id?: string; name?: string; role?: string }
const farmerVerification = JSON.parse(localStorage.getItem('taste-farmer-verification') ?? 'null') as { status?: string } | null
const isApprovedFarmer = signedInUser.role === 'farmer' && farmerVerification?.status === 'Approved'

const savedFarmerListings = JSON.parse(localStorage.getItem('taste-farmer-listings') ?? '[]') as Array<{ id: string; name: string; image: string; status?: string; quantity?: number; location?: string; price?: number; farmer?: string; farmerId?: string }>
type BrowseListing = { id: string | number; name: string; category: string; status: string; image: string; price?: number; quantity?: number; location?: string; farmer?: string; farmerId?: string }
const listings: BrowseListing[] = [
  ...savedFarmerListings.map((item) => ({ ...item, image: item.id === 'mango' ? '/images/mango.jpg' : item.id === 'kiwi' ? '/images/kiwi.jpg' : item.id === 'avocado' ? '/images/avocado.jpg' : item.image, farmer: item.farmer ?? 'H : Farmer', farmerId: item.farmerId ?? 'fmr-001', category: 'Fruits', status: item.status ?? 'Available' })),
  { id: 1, name: 'Mango', category: 'Fruits', status: 'Available', image: '/images/mango.jpg', farmer: 'H : Farmer', farmerId: 'fmr-001' },
  { id: 2, name: 'Kiwi', category: 'Fruits', status: 'Pre-Order', image: '/images/kiwi.jpg', farmer: 'H : Farmer', farmerId: 'fmr-001' },
  { id: 3, name: 'Avocado', category: 'Fruits', status: 'Available', image: '/images/avocado.jpg', farmer: 'H : Farmer', farmerId: 'fmr-001' },
]
const saved = ref<Array<string | number>>(JSON.parse(localStorage.getItem('taste-saved-listings') ?? '[]'))
const filterOpen = ref(false)
const category = ref('All')
const selectedNames = ref<string[]>([])
const dropdownOpen = ref(false)
const dropdownNames = ref<string[]>([])
const selectedStatuses = ref<string[]>(['Available'])
const applied = ref({ category: 'All', names: [] as string[], statuses: ['Available'] })
const search = ref('')
const filteredListings = computed(() => listings.filter((item) => (applied.value.category === 'All' || item.category === applied.value.category) && (!applied.value.names.length || applied.value.names.includes(item.name)) && (!applied.value.statuses.length || applied.value.statuses.includes(item.status)) && item.name.toLowerCase().includes(search.value.toLowerCase())))
function toggleValue(values: string[], value: string) { return values.includes(value) ? values.filter((item) => item !== value) : [...values, value] }
function confirmSubcategories() { selectedNames.value = [...dropdownNames.value]; dropdownOpen.value = false }
function applyFilters() { applied.value = { category: category.value, names: [...selectedNames.value], statuses: [...selectedStatuses.value] }; filterOpen.value = false }
function clearFilters() { category.value = 'All'; selectedNames.value = []; dropdownNames.value = []; selectedStatuses.value = []; applied.value = { category: 'All', names: [], statuses: [] } }
function toggleSaved(id: string | number) {
  saved.value = saved.value.includes(id) ? saved.value.filter((item) => item !== id) : [...saved.value, id]
  localStorage.setItem('taste-saved-listings', JSON.stringify(saved.value))
}
</script>

<template>
  <main class="browse-page">
    <header class="browse-header">
      <span class="browse-logo">Taste</span>
      <label class="browse-search"><FontAwesomeIcon :icon="faMagnifyingGlass" aria-hidden="true" /><input v-model="search" placeholder="Search for your products" /></label>
      <button v-if="signedInUser.role === 'farmer'" class="farmer-portal-link" @click="router.push('/farmer-portal')">Farmer Portal</button>
      <button class="icon-button filter-trigger" aria-label="Filters" @click="filterOpen = true"><FontAwesomeIcon :icon="faSliders" /></button>
      <a class="icon-button profile" href="/account" aria-label="User account"><img v-if="avatarUrl" :src="avatarUrl" alt="Profile picture" /><FontAwesomeIcon v-else :icon="faUser" /></a>
    </header>
    <div class="browse-content">
      <aside class="browse-sidebar" aria-label="Browse navigation"><button aria-label="Listings"><FontAwesomeIcon :icon="faList" /></button><button aria-label="Messages" @click="router.push('/messages')"><FontAwesomeIcon :icon="faMessage" /></button><button aria-label="History" @click="router.push('/history')"><FontAwesomeIcon :icon="faClockRotateLeft" /></button><button aria-label="Saved listings" @click="router.push('/saved')"><FontAwesomeIcon :icon="faBookmark" /></button></aside>
      <section class="listing-grid" aria-label="Available produce">
        <article v-for="listing in filteredListings" :key="listing.id" class="listing-card">
          <img :src="listing.image" :alt="listing.name" />
          <div class="listing-title"><span>{{ listing.name }}</span><span>${{ Number(listing.price ?? 3).toFixed(2) }}/KG</span></div>
          <div class="listing-meta"><span>Location : {{ listing.location ?? 'Phnom Penh , Cambodia' }}</span><span>Available : {{ listing.quantity ?? 20 }} KG</span></div>
          <div class="listing-meta listing-farmer"><span>{{ listing.farmer ?? 'John (Farmer)' }} | ID : {{ listing.farmerId ?? '22ddd1kd' }}</span><span>Status : {{ listing.status === 'Available' ? 'In Stock' : listing.status }}</span></div>
          <div class="listing-actions">
            <button class="bookmark" :class="{ saved: saved.includes(listing.id) }" :aria-label="saved.includes(listing.id) ? 'Remove bookmark' : 'Save listing'" @click="toggleSaved(listing.id)"></button>
            <button class="offer-button" @click="router.push('/crops/' + listing.id)">View and Offer</button>
          </div>
        </article>
      </section>
    </div>
    <footer v-if="!isApprovedFarmer" class="wholesale-banner"><strong>Are you a farmer or crop distributor?</strong><em>Open Wholesale Account and</em><button @click="router.push('/farmer-verification')">Start Farmer Verification ?</button></footer>
    <div v-if="filterOpen" class="filter-backdrop" @click.self="filterOpen = false"><aside class="filter-panel" aria-label="Product filters">
      <header class="filter-heading"><h2> Filter</h2><button aria-label="Close filters" @click="filterOpen = false"><FontAwesomeIcon :icon="faXmark" /></button></header>
      <section><h3>Crop Category</h3><div class="category-options"><button v-for="item in ['All','Fruits','Vegetables']" :key="item" :class="{ selected: category === item }" @click="category = item">{{ item }}</button></div></section>
      <section class="subcategory-section"><h3>Sub Category</h3><button class="subcategory-trigger" @click="dropdownOpen = !dropdownOpen">Search for fruits/vegetables <FontAwesomeIcon :icon="faMagnifyingGlass" aria-hidden="true" /></button><div v-if="dropdownOpen" class="subcategory-menu"><label v-for="item in ['Mango','Kiwi','Avocado']" :key="item"><input type="checkbox" :checked="dropdownNames.includes(item)" @change="dropdownNames = toggleValue(dropdownNames, item)" />{{ item }}</label><button class="subcategory-ok" @click="confirmSubcategories">OK</button></div><label v-for="item in selectedNames" :key="item" class="selected-subcategory"><input type="checkbox" checked @change="selectedNames = selectedNames.filter(name => name !== item)" />{{ item }}</label></section>
      <section class="stock-section"><h3>Stock Status</h3><label v-for="item in ['Available','Pre-Order','Out of Stock']" :key="item"><input type="checkbox" :checked="selectedStatuses.includes(item)" @change="selectedStatuses = toggleValue(selectedStatuses, item)" /> {{ item }}</label></section>
      <div class="filter-actions"><button @click="clearFilters">CLEAR ALL</button><button @click="applyFilters">APPLY FILTERS</button></div>
    </aside></div>
  </main>
</template>

<style scoped>
.browse-page{min-height:100vh;background:#fff;color:#080808;font-family:Arial,sans-serif}.browse-header{height:110px;background:#35423c;display:flex;align-items:center;padding:0 24px;gap:5vw}.browse-logo{font:38px 'DM Mono',monospace;color:#a4b7ad;letter-spacing:.08em}.browse-search{height:52px;max-width:655px;flex:1;background:#727875;border-radius:8px;display:flex;align-items:center;padding:0 20px;gap:12px;font-size:30px}.browse-search input{border:0;outline:0;background:transparent;width:100%;font-size:16px;color:#111}.browse-search input::placeholder{color:#111;opacity:1}.icon-button{margin-left:auto;background:none;border:0;color:#050706;font-size:42px;line-height:1;cursor:pointer}.icon-button.profile{font-size:38px;margin-left:3vw}.browse-content{display:grid;grid-template-columns:52px 1fr;gap:15px;padding:27px 12px 0 0}.browse-sidebar{display:flex;flex-direction:column;align-items:center;gap:30px}.browse-sidebar button{border:0;background:none;color:#080808;font-size:35px;cursor:pointer}.listing-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:11px}.listing-card{border:1px solid #222;padding:20px 22px 24px;min-width:0}.listing-card>img{width:100%;height:clamp(210px,23vw,325px);object-fit:cover;border-radius:5px}.listing-title,.listing-meta{display:flex;justify-content:space-between;gap:8px}.listing-title{font-size:16px;margin:14px 0 8px}.listing-meta{font-size:11px;color:#555;margin-top:8px}.listing-farmer{font:10px 'DM Mono',monospace;color:#111}.listing-actions{display:flex;align-items:center;justify-content:space-between;margin-top:30px;gap:10px}.bookmark{width:21px;height:30px;border:0;background:#050505;clip-path:polygon(0 0,100% 0,100% 100%,50% 77%,0 100%);cursor:pointer}.bookmark.saved{background:#58a17a}.offer-button{background:#5da47f;border:1px solid #111;border-radius:6px;color:white;padding:14px 17px;font-size:16px;cursor:pointer}@media(max-width:850px){.browse-header{height:82px;padding:0 16px;gap:18px}.browse-logo{font-size:28px}.browse-search{height:44px}.icon-button{font-size:32px}.listing-grid{grid-template-columns:repeat(auto-fit,minmax(265px,1fr))}.listing-card{padding:14px}.listing-card>img{height:240px}}@media(max-width:560px){.browse-header{flex-wrap:wrap;height:auto;padding:14px;gap:12px}.browse-logo{font-size:24px}.browse-search{order:3;flex-basis:100%;max-width:none}.browse-content{grid-template-columns:35px 1fr;gap:8px;padding-top:12px}.browse-sidebar{gap:15px}.browse-sidebar button{font-size:27px}.listing-grid{grid-template-columns:1fr}.listing-card>img{height:58vw;max-height:340px}.listing-actions{margin-top:20px}.offer-button{font-size:14px;padding:12px 15px}}

.browse-page{padding-bottom:60px}.wholesale-banner{position:fixed;z-index:2;bottom:0;left:0;right:0;min-height:46px;padding:6px 2vw;background:#197047;color:#fff;display:flex;align-items:center;justify-content:center;gap:24px;font-size:19px}.wholesale-banner em{font-weight:bold}.wholesale-banner button{border:1px solid #111;background:#fff;border-radius:5px;padding:9px 12px;color:#28764e}.filter-backdrop{position:fixed;inset:0;z-index:5;background:#0002}.filter-panel{position:absolute;right:0;top:0;height:100%;width:min(560px,100vw);overflow:auto;background:#e8f4ee;border-left:1px solid #111;padding:24px 34px;display:flex;flex-direction:column}.filter-heading{display:flex;align-items:center}.filter-heading h2{font: bold 30px 'DM Mono',monospace;margin:0}.filter-heading button{margin-left:auto;border:0;background:none;font-size:42px;cursor:pointer}.filter-panel section{margin:35px 8px 0}.filter-panel h3{font-size:23px;margin:0 0 12px}.category-options{display:grid;grid-template-columns:1fr 1fr;gap:18px 50px;padding:0 6px}.category-options button{height:48px;border:1px solid #111;border-radius:12px;background:white;font-size:20px}.category-options button.selected{background:#9db2a8}.filter-panel select{width:100%;height:145px;border:1px solid #111;border-radius:8px;background:#fff;padding:10px}.filter-panel option{padding:7px}.stock-section label{display:flex;align-items:center;gap:12px;font-size:20px;margin:12px 4px}.stock-section input{width:21px;height:21px;accent-color:#5da47f}.filter-actions{margin-top:auto;padding-top:28px;display:flex;justify-content:space-between;gap:15px}.filter-actions button{height:43px;border:1px solid #111;border-radius:6px;padding:0 20px;background:#ddd}.filter-actions button+button{background:#5da47f;color:white;min-width:180px}@media(max-width:600px){.wholesale-banner{gap:7px;font-size:10px;padding:6px}.wholesale-banner button{font-size:9px;padding:7px}.filter-panel{padding:18px}.category-options{gap:12px}.category-options button{font-size:15px}}
.subcategory-trigger{width:100%;height:48px;border:1px solid #111;border-radius:12px;background:#fff;text-align:left;padding:0 12px;display:flex;align-items:center;justify-content:space-between;font-size:16px}.subcategory-trigger span{font-size:25px}.subcategory-menu{position:relative;z-index:6;border:1px solid #111;background:white;padding:8px 10px 14px;display:grid;gap:8px}.subcategory-menu label{display:flex;align-items:center;gap:8px;font-size:17px}.subcategory-menu input,.selected-subcategory input{width:22px;height:22px;accent-color:#111}.subcategory-ok{justify-self:end;background:#6055f5;color:white;border:1px solid #111;border-radius:8px;padding:8px 22px;font-size:16px}.selected-subcategory{display:flex;align-items:center;gap:12px;font-size:20px;margin:20px 10px}
.icon-button.profile img{display:block;width:38px;height:38px;border-radius:50%;object-fit:cover}
.wholesale-banner{flex-wrap:nowrap;white-space:nowrap;gap:16px;padding:6px 16px;font-size:clamp(13px,1.2vw,19px)}.wholesale-banner button{font-size:clamp(13px,1.1vw,17px);white-space:nowrap;flex:none}@media(max-width:760px){.wholesale-banner{position:static;flex-wrap:wrap;min-height:0;gap:8px 12px;padding:12px;font-size:14px;text-align:center}.wholesale-banner button{padding:8px 10px;font-size:13px}.browse-page{padding-bottom:0}}
.browse-content{grid-template-columns:58px 1fr;padding-top:24px}.browse-sidebar{gap:36px}.browse-sidebar button{font-size:35px}.farmer-portal-link{border:0;background:none;color:#fff;text-decoration:underline;font:16px 'DM Mono',monospace;white-space:nowrap;cursor:pointer}@media(max-width:760px){.farmer-portal-link{font-size:13px}}
</style>
