<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faSliders, faUser, faList, faMessage, faClockRotateLeft, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { getProfileAvatar } from '../services/profileAvatar'

const router = useRouter()
const avatarUrl = getProfileAvatar()
const signedInUser = JSON.parse(localStorage.getItem('taste-user') ?? '{}') as { role?: string }
const listings = [
  { id: 1, name: 'Mango', price: '$3.00/KG', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=800&q=80' },
  { id: 2, name: 'Kiwi', price: '$5.00/KG', image: 'https://images.unsplash.com/photo-1585059895524-72359e06133a?auto=format&fit=crop&w=800&q=80' },
  { id: 3, name: 'Avocado', price: '$4.00/KG', image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80' },
]
const savedIds = ref<number[]>(JSON.parse(localStorage.getItem('taste-saved-listings') ?? '[]'))
const savedListings = computed(() => listings.filter((item) => savedIds.value.includes(item.id)))
function removeSaved(id: number) {
  savedIds.value = savedIds.value.filter((savedId) => savedId !== id)
  localStorage.setItem('taste-saved-listings', JSON.stringify(savedIds.value))
}
</script>

<template>
  <main class="saved-page">
    <header class="customer-header"><button class="customer-logo" @click="router.push('/browse')">Taste</button><label class="customer-search"><FontAwesomeIcon :icon="faMagnifyingGlass" aria-hidden="true" /><input placeholder="Search for your products" /></label><button v-if="signedInUser.role === 'farmer'" class="farmer-portal-link" @click="router.push('/farmer-portal')">Farmer Portal</button><button class="customer-icon" aria-label="Filters" @click="router.push('/browse')"><FontAwesomeIcon :icon="faSliders" /></button><button class="customer-profile" aria-label="User account" @click="router.push('/account')"><img v-if="avatarUrl" :src="avatarUrl" alt="Profile picture" /><FontAwesomeIcon v-else :icon="faUser" /></button></header>
    <div class="saved-layout"><aside class="saved-nav"><button aria-label="Listings" @click="router.push('/browse')"><FontAwesomeIcon :icon="faList" /></button><button aria-label="Messages" @click="router.push('/messages')"><FontAwesomeIcon :icon="faMessage" /></button><button aria-label="History" @click="router.push('/history')"><FontAwesomeIcon :icon="faClockRotateLeft" /></button><button class="active" aria-label="Saved listings"><FontAwesomeIcon :icon="faBookmark" /></button></aside>
      <section class="saved-content"><h1>Saved Product</h1><p v-if="savedListings.length === 0" class="empty-state">Your saved produce will appear here. Use the bookmark on a listing to save it.</p><div v-else class="saved-grid"><article v-for="item in savedListings" :key="item.id" class="saved-card"><img :src="item.image" :alt="item.name" /><div class="saved-title"><span>{{ item.name }}</span><span>{{ item.price }}</span></div><div class="saved-meta"><span>Location : Phnom Penh · Cambodia</span><span>Available : 20 KG</span></div><div class="saved-meta farmer">John (Farmer) | ID : 22ddd1kd <span>Status : In Stock</span></div><div class="saved-actions"><button class="saved-bookmark" aria-label="Remove saved listing" @click="removeSaved(item.id)"><FontAwesomeIcon :icon="faBookmark" /></button><button class="buy-button">Buy</button></div></article></div></section>
    </div>
  </main>
</template>

<style scoped>
.saved-page{min-height:100vh;background:#fff;color:#080808;font-family:Arial,sans-serif}.customer-header{height:110px;background:#35423c;display:flex;align-items:center;padding:0 24px;gap:5vw}.customer-logo{font:38px 'DM Mono',monospace;color:#a4b7ad;letter-spacing:.08em;background:none;border:0;cursor:pointer}.customer-search{height:52px;max-width:655px;flex:1;background:#727875;border-radius:8px;display:flex;align-items:center;padding:0 20px;gap:12px;font-size:30px}.customer-search input{border:0;outline:0;background:transparent;width:100%;font-size:16px}.customer-icon,.customer-profile{margin-left:auto;background:none;border:0;font-size:42px;cursor:pointer}.customer-profile{font-size:38px;margin-left:3vw}.saved-layout{display:grid;grid-template-columns:58px 1fr}.saved-nav{border-right:1px solid #111;display:flex;flex-direction:column;align-items:center;gap:28px;padding-top:24px}.saved-nav button{border:0;background:none;font-size:35px;cursor:pointer}.saved-nav .active,.saved-bookmark{color:#278552}.saved-content{min-width:0}.saved-grid{display:grid;grid-template-columns:repeat(3,minmax(260px,1fr));gap:8px}.saved-content h1{font-size:24px;font-weight:400;margin:0;padding:15px 22px}.saved-card{border:1px solid #111;padding:28px 23px 24px;min-width:0}.saved-card>img{display:block;width:100%;height:clamp(210px,23vw,325px);object-fit:cover;border-radius:5px}.saved-title,.saved-meta{display:flex;justify-content:space-between;gap:8px}.saved-title{font-size:16px;margin:16px 0 10px}.saved-meta{font-size:11px;color:#555;margin-top:8px}.farmer{font:10px 'DM Mono',monospace;color:#111}.saved-actions{display:flex;align-items:center;justify-content:space-between;margin-top:40px}.saved-bookmark{border:0;background:none;font-size:32px;cursor:pointer}.buy-button{background:#5da47f;border:1px solid #111;border-radius:8px;color:white;padding:10px 24px;font-size:16px;cursor:pointer}.empty-state{margin:20px 24px;padding:30px;border:1px dashed #888;color:#555}@media(max-width:900px){.customer-header{height:82px;padding:0 16px;gap:18px}.customer-logo{font-size:28px}.customer-search{height:44px}.customer-icon,.customer-profile{font-size:32px}.saved-grid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}.saved-card{padding:16px}.saved-card>img{height:240px}}@media(max-width:560px){.customer-header{flex-wrap:wrap;height:auto;padding:14px;gap:12px}.customer-logo{font-size:24px}.customer-search{order:3;flex-basis:100%}.saved-layout{grid-template-columns:40px 1fr}.saved-grid{grid-template-columns:1fr}.saved-card>img{height:58vw;max-height:340px}.saved-actions{margin-top:20px}}
.customer-profile img{display:block;width:38px;height:38px;border-radius:50%;object-fit:cover}@media(max-width:900px){.customer-profile img{width:32px;height:32px}}.saved-layout{grid-template-columns:58px 1fr}.saved-nav{gap:36px;border-right:0}.saved-nav button{font-size:35px}.farmer-portal-link{border:0;background:none;color:#fff;text-decoration:underline;font:16px 'DM Mono',monospace;white-space:nowrap;cursor:pointer}@media(max-width:900px){.farmer-portal-link{font-size:13px}}</style>
