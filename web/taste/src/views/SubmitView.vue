<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faSliders, faUser, faList, faMessage, faClockRotateLeft, faBookmark, faXmark, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const name = ref('')
const variety = ref('')
const status = ref('Available')
const quantity = ref('')
const location = ref('')
const price = ref('')
const description = ref('')
const image = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
const error = ref('')
type SavedListing = { id: string; name: string; image: string; variety?: string; status?: string; quantity?: number; location?: string; price?: number; description?: string }
async function chooseImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { error.value = 'Choose an image file.'; return }
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    image.value = canvas.toDataURL('image/jpeg', 0.68)
    error.value = ''
  } catch {
    error.value = 'This image could not be processed. Choose another photo.'
  }
}
function submitListing() {
  if (!name.value.trim() || !quantity.value || !location.value.trim() || !price.value || !description.value.trim()) {
    error.value = 'Complete the required listing details.'
    return
  }
  const listings = JSON.parse(localStorage.getItem('taste-farmer-listings') ?? 'null') as SavedListing[] | null ?? [
    { id: 'mango', name: 'Mango', image: '/images/mango.jpg' },
    { id: 'avocado', name: 'Avocado', image: '/images/avocado.jpg' },
  ]
  const signedInUser = JSON.parse(localStorage.getItem('taste-user') ?? '{}') as { id?: string; name?: string }
  const listing = { id: `farmer-${Date.now()}`, farmerId: signedInUser.id ?? 'fmr-001', farmer: signedInUser.name ?? 'H : Farmer', name: name.value.trim(), variety: variety.value.trim(), status: status.value, quantity: Number(quantity.value), location: location.value.trim(), price: Number(price.value), description: description.value.trim(), image: image.value || '/images/fruit-plate.jpg' }
  listings.unshift(listing)
  try {
    localStorage.setItem('taste-farmer-listings', JSON.stringify(listings))
  } catch {
    const compactListings = listings.map((item) => ({ ...item, image: item.image.startsWith('data:image/') ? '/images/fruit-plate.jpg' : item.image }))
    try {
      localStorage.setItem('taste-farmer-listings', JSON.stringify(compactListings))
    } catch {
      error.value = 'Browser storage is full. Remove some saved data and try again.'
      return
    }
  }
  router.push('/farmer-portal')
}
</script>

<template>
  <main class="create-listing-page">
    <header class="create-header"><button class="create-logo" @click="router.push('/browse')">Taste</button><label class="create-search"><FontAwesomeIcon :icon="faMagnifyingGlass" /><input placeholder="Search for your products" /></label><button class="create-portal-link" @click="router.push('/farmer-portal')">Farmer Portal</button><button class="create-header-icon" aria-label="Filters" @click="router.push('/browse')"><FontAwesomeIcon :icon="faSliders" /></button><button class="create-profile" aria-label="User account" @click="router.push('/account')"><FontAwesomeIcon :icon="faUser" /></button></header>
    <div class="create-layout"><aside class="create-sidebar"><button aria-label="Listings" @click="router.push('/browse')"><FontAwesomeIcon :icon="faList" /></button><button aria-label="Messages" @click="router.push('/messages')"><FontAwesomeIcon :icon="faMessage" /></button><button aria-label="History" @click="router.push('/history')"><FontAwesomeIcon :icon="faClockRotateLeft" /></button><button aria-label="Saved listings" @click="router.push('/saved')"><FontAwesomeIcon :icon="faBookmark" /></button></aside>
      <section class="create-content"><div class="create-title"><button aria-label="Back to Farmer Portal" @click="router.push('/farmer-portal')">‹</button><h1>Create a new crop listing</h1><button aria-label="Close" @click="router.push('/farmer-portal')"><FontAwesomeIcon :icon="faXmark" /></button></div>
        <form class="crop-form" @submit.prevent="submitListing"><section class="basic-info"><h2>Basic Crop Information<span>*</span></h2><label>Crop Name (e.g., Apple, Banana)*:<input v-model="name" required /></label><label>Variety (e.g., “Red Apple”, “”) :<input v-model="variety" /></label><label>Status:<select v-model="status"><option>Available</option><option>Pre-Order</option></select></label><label>Total Weight:<input v-model="quantity" type="number" min="1" required /></label><label>Location:<input v-model="location" required /></label><label>Price per KG:<input v-model="price" type="number" min="0.01" step="0.01" placeholder="e.g. 3.50" required /></label></section>
          <label class="description-field">Product Description*<textarea v-model="description" placeholder="Write a summary about the crop" required /></label>
          <section class="photos-field"><h2>Photos*</h2><div class="photo-upload" :style="image ? { backgroundImage: `url(${image})` } : undefined" @click="fileInput?.click()"><input ref="fileInput" type="file" accept="image/*" @change="chooseImage" /><template v-if="!image"><FontAwesomeIcon :icon="faCloudArrowUp" /><span>Drag and drop the photo of the products or <u>browse files</u></span><small>Accepted formats: PNG, JPG (10MB max per file)</small></template></div></section>
          <div class="form-actions"><p v-if="error" role="alert">{{ error }}</p><button type="button" class="cancel" @click="router.push('/farmer-portal')">CANCEL</button><button class="done" type="submit">DONE</button></div>
        </form>
      </section>
    </div>
  </main>
</template>

<style scoped>
.create-listing-page{min-height:100vh;background:#fff;color:#080808;font-family:Arial,sans-serif}.create-header{height:110px;background:#35423c;display:flex;align-items:center;padding:0 24px;gap:4vw}.create-logo{font:38px 'DM Mono',monospace;color:#a4b7ad;letter-spacing:.08em;border:0;background:none;cursor:pointer}.create-search{height:52px;max-width:655px;flex:1;background:#727875;border-radius:8px;display:flex;align-items:center;padding:0 20px;gap:12px}.create-search input{border:0;outline:0;background:transparent;width:100%;font-size:16px}.create-portal-link{border:0;background:none;color:white;text-decoration:underline;font:16px 'DM Mono',monospace;white-space:nowrap;cursor:pointer}.create-header-icon,.create-profile{border:0;background:none;font-size:35px;cursor:pointer}.create-layout{display:grid;grid-template-columns:58px 1fr;min-height:calc(100vh - 110px)}.create-sidebar{display:flex;flex-direction:column;align-items:center;gap:36px;padding-top:24px}.create-sidebar button{border:0;background:none;font-size:35px;cursor:pointer}.create-content{padding:24px 24px 50px;min-width:0}.create-title{display:flex;align-items:center;gap:22px;margin-bottom:24px}.create-title h1{font:bold 30px 'DM Mono',monospace;margin:0}.create-title button{border:0;background:none;font-size:34px;cursor:pointer}.create-title button:last-child{margin-left:auto}.crop-form{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(300px,.8fr);grid-template-rows:auto auto;gap:38px 40px;max-width:1400px}.basic-info{border:1px solid #111;border-radius:9px;box-shadow:0 2px 4px #0003;padding:16px 30px;min-height:315px}.basic-info h2,.photos-field h2{font-size:19px;font-weight:400;margin:0 0 18px}.basic-info h2 span{color:#c33}.basic-info label{display:flex;align-items:center;gap:8px;font-size:14px;margin:12px 0}.basic-info input{width:min(40%,280px);height:28px;border:0;border-bottom:1px solid #111;outline:0}.basic-info select{height:32px;border:1px solid #111;border-radius:12px;background:#fff;color:#28764e;padding:0 14px}.description-field{display:flex;flex-direction:column;gap:12px;font-size:19px}.description-field textarea{height:315px;resize:vertical;border:1px solid #111;border-radius:9px;box-shadow:0 2px 4px #0003;padding:24px;font:14px Arial}.photos-field{grid-column:1}.photos-field h2{margin-bottom:12px}.photo-upload{height:315px;border:1px solid #111;border-radius:9px;box-shadow:0 2px 4px #0003;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;cursor:pointer;background-position:center;background-size:cover}.photo-upload input{display:none}.photo-upload svg{font-size:28px}.photo-upload span{font-size:14px}.photo-upload u{color:#28764e;font-weight:bold}.photo-upload small{font-size:10px;color:#666}.form-actions{display:flex;align-items:end;justify-content:flex-end;gap:40px;padding-bottom:10px}.form-actions p{margin-right:auto;color:#b33}.form-actions button{min-width:95px;padding:12px 18px;border:1px solid #111;border-radius:6px;cursor:pointer}.cancel{background:#ddd}.done{background:#5da47f;color:#fff}
@media(max-width:850px){.create-header{gap:16px;padding:0 16px}.create-title h1{font-size:24px}.crop-form{grid-template-columns:1fr;gap:24px}.description-field,.photos-field{grid-column:1}.description-field textarea{height:220px}.photo-upload{height:220px}.basic-info{min-height:0}.form-actions{justify-content:flex-start}}
@media(max-width:600px){.create-header{height:auto;min-height:78px;flex-wrap:wrap;padding:12px}.create-logo{font-size:27px}.create-search{order:4;flex-basis:100%;height:44px}.create-portal-link{margin-left:auto;font-size:13px}.create-layout{grid-template-columns:48px 1fr}.create-sidebar{gap:24px}.create-sidebar button{font-size:29px}.create-content{padding:20px 12px}.create-title{gap:8px}.create-title h1{font-size:18px}.basic-info{padding:14px}.basic-info label{flex-wrap:wrap}.basic-info input{width:100%;flex-basis:100%}.description-field textarea{height:180px}.photo-upload{height:180px}.form-actions{gap:12px}.form-actions button{min-width:75px}}
</style>
