<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faSliders, faUser, faList, faMessage, faClockRotateLeft, faBookmark, faArrowRight, faArrowUp, faImage, faXmark } from '@fortawesome/free-solid-svg-icons'
import { cropService, type Crop } from '../services/crops'
import { getProfileAvatar } from '../services/profileAvatar'

const props = defineProps<{ id: string }>()
const router = useRouter()
type Product = Crop & { status?: string; variety?: string; farmerId?: string }
const product = ref<Product>()
const loading = ref(true)
const avatarUrl = getProfileAvatar()
const signedInUser = JSON.parse(localStorage.getItem('taste-user') ?? '{}') as { id?: string; name?: string; role?: string }
const savedIds = ref<Array<string | number>>(JSON.parse(localStorage.getItem('taste-saved-listings') ?? '[]'))
const requestCrop = ref('')
const requestWeight = ref('')
const requestDiscount = ref('')
const requestNote = ref('')
const requestMessage = ref('')
type CustomerReview = { id: string; name: string; rating: number; text: string; image?: string }
const customerReviews = ref<CustomerReview[]>([])
const reviewText = ref('')
const reviewRating = ref(5)
const reviewImage = ref('')
const reviewImageInput = ref<HTMLInputElement | null>(null)
const reviewMessage = ref('')
const isSaved = computed(() => savedIds.value.includes(props.id))
const productImage = computed(() => {
  const name = product.value?.name.toLowerCase() ?? ''
  if (name.includes('mango')) return '/images/mango.jpg'
  if (name.includes('kiwi')) return '/images/kiwi.jpg'
  if (name.includes('avocado')) return '/images/avocado.jpg'
  return product.value?.image ?? '/images/fruit-plate.jpg'
})

async function loadProduct() {
  loading.value = true
  const farmerListings = JSON.parse(localStorage.getItem('taste-farmer-listings') ?? '[]') as Array<Product>
  const farmerProduct = farmerListings.find((item) => item.id === props.id)
  const crop = farmerProduct ?? await cropService.get(props.id)
  product.value = crop ? { ...crop, status: farmerProduct?.status ?? 'Available' } : undefined
  customerReviews.value = JSON.parse(localStorage.getItem(`taste-crop-reviews:${props.id}`) ?? '[]') as CustomerReview[]
  loading.value = false
}
onMounted(loadProduct)
watch(() => props.id, loadProduct)

function toggleSaved() {
  savedIds.value = isSaved.value ? savedIds.value.filter((id) => id !== props.id) : [...savedIds.value, props.id]
  localStorage.setItem('taste-saved-listings', JSON.stringify(savedIds.value))
}
function sendRequest() {
  if (!product.value || !requestCrop.value.trim() || !requestWeight.value || !requestDiscount.value) {
    requestMessage.value = 'Complete the crop type, weight, and discount fields.'
    return
  }
  const requests = JSON.parse(localStorage.getItem('taste-buy-requests') ?? '[]') as Array<Record<string, string>>
  requests.push({ id: `request-${Date.now()}`, buyer: signedInUser.name ?? 'Customer', buyerId: signedInUser.id ?? '', farmerId: product.value.farmerId ?? 'fmr-001', productId: product.value.id, crop: requestCrop.value, weight: requestWeight.value, discount: requestDiscount.value, location: signedInUser.id ? (JSON.parse(localStorage.getItem('taste-customer-profile') ?? '{}') as { location?: string }).location ?? 'Phnom Penh, Cambodia' : 'Phnom Penh, Cambodia', note: requestNote.value, status: 'Pending' })
  localStorage.setItem('taste-buy-requests', JSON.stringify(requests))
  requestMessage.value = 'Your buy request has been sent.'
  requestCrop.value = ''
  requestWeight.value = ''
  requestDiscount.value = ''
  requestNote.value = ''
}
function submitReview() {
  const text = reviewText.value.trim()
  if (!text) {
    reviewMessage.value = 'Write a review before submitting.'
    return
  }
  const review: CustomerReview = { id: `review-${Date.now()}`, name: signedInUser.name ?? 'Customer', rating: reviewRating.value, text, image: reviewImage.value || undefined }
  customerReviews.value.unshift(review)
  try {
    localStorage.setItem(`taste-crop-reviews:${props.id}`, JSON.stringify(customerReviews.value))
  } catch {
    customerReviews.value.shift()
    reviewMessage.value = 'The picture is too large to save. Choose a smaller image.'
    return
  }
  reviewText.value = ''
  reviewImage.value = ''
  reviewMessage.value = 'Your review has been added.'
}
async function chooseReviewImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  input.value = ''
  if (!file.type.startsWith('image/')) {
    reviewMessage.value = 'Choose an image file.'
    return
  }
  try {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, 900 / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(bitmap.width * scale)
    canvas.height = Math.round(bitmap.height * scale)
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()
    reviewImage.value = canvas.toDataURL('image/jpeg', 0.68)
    reviewMessage.value = ''
  } catch {
    reviewMessage.value = 'This picture could not be processed. Choose another image.'
  }
}
</script>

<template>
  <main class="product-page">
    <header class="product-header"><button class="product-logo" @click="router.push('/browse')">Taste</button><label class="product-search"><FontAwesomeIcon :icon="faMagnifyingGlass" /><input placeholder="Search for your products" /></label><button v-if="signedInUser.role === 'farmer'" class="farmer-link" @click="router.push('/farmer-portal')">Farmer Portal</button><button class="product-filter" aria-label="Filters" @click="router.push('/browse')"><FontAwesomeIcon :icon="faSliders" /></button><button class="product-profile" aria-label="User account" @click="router.push('/account')"><img v-if="avatarUrl" :src="avatarUrl" alt="Profile picture" /><FontAwesomeIcon v-else :icon="faUser" /></button></header>
    <div class="product-layout"><aside class="product-sidebar"><button aria-label="Listings" @click="router.push('/browse')"><FontAwesomeIcon :icon="faList" /></button><button aria-label="Messages" @click="router.push('/messages')"><FontAwesomeIcon :icon="faMessage" /></button><button aria-label="History" @click="router.push('/history')"><FontAwesomeIcon :icon="faClockRotateLeft" /></button><button aria-label="Saved listings" @click="router.push('/saved')"><FontAwesomeIcon :icon="faBookmark" /></button></aside>
      <section v-if="loading" class="product-loading">Loading product…</section>
      <section v-else-if="product" class="product-content"><button class="product-back" aria-label="Back to browse" @click="router.back()">‹</button>
        <div class="product-main"><div class="product-left"><section class="product-intro"><div><h1>{{ product.name }}</h1><p>{{ product.description || `${product.name} freshly harvested and ready for your order.` }}</p></div><div class="product-state"><button :aria-label="isSaved ? 'Remove from saved listings' : 'Save listing'" @click="toggleSaved"><FontAwesomeIcon :icon="faBookmark" /></button><span>Status : <em>{{ product.status }}</em></span></div></section>
          <img class="product-image" :src="productImage" :alt="product.name" /><section class="product-facts"><p>Price : ${{ Number(product.price).toFixed(2) }}/KG <span>Total Harvest : {{ product.quantity }}KG</span></p><p>Location :<br />{{ product.location }}</p></section>
          <section class="reviews"><div class="review-rating"><h2>Customer reviews</h2><strong>★★★★★</strong><span>4.5 out of 5</span><p>30 ratings</p><div v-for="rating in [5,4,3,2,1]" :key="rating" class="rating-row"><span>{{ rating }} star</span><i><b :style="{ width: `${rating === 5 ? 70 : rating === 4 ? 55 : 35}%` }"></b></i><small>{{ rating === 5 ? 0 : rating === 4 ? 10 : rating === 3 ? 10 : 5 }} users</small></div></div><article v-for="review in 2" :key="review" class="review-card"><FontAwesomeIcon :icon="faUser" /><span>User</span><strong>★★★★☆</strong><p>“Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.”</p></article><article v-for="review in customerReviews" :key="review.id" class="review-card user-review"><FontAwesomeIcon :icon="faUser" /><span>{{ review.name }}</span><strong>{{ '★'.repeat(review.rating) }}{{ '☆'.repeat(5 - review.rating) }}</strong><img v-if="review.image" class="review-attachment" :src="review.image" alt="Picture attached to review" /><p>{{ review.text }}</p></article></section>
        </div><aside class="product-right"><form class="buy-request-form" @submit.prevent="sendRequest"><h2>Send Buy Request</h2><small>Request to buy the product procedure:</small><label>Crop Type:<input v-model="requestCrop" required /></label><label>Weight :<input v-model="requestWeight" type="number" min="1" required /></label><label>Requesting a discount price :<input v-model="requestDiscount" type="number" min="0" step="0.01" required /></label><label>Add Note :<textarea v-model="requestNote" /></label><p v-if="requestMessage" role="status">{{ requestMessage }}</p><div><button type="button" @click="router.push('/browse')">Cancel</button><button type="submit">Send</button></div></form>
          <article class="seller-card"><div class="seller-avatar">{{ (product.farmer || 'Farmer').slice(0,2).toUpperCase() }}</div><div><strong>{{ product.farmer || 'Farmer' }}</strong><small>{{ product.location }}</small><small>★ 4.5/5 (20 orders) &nbsp; | &nbsp; 4 years on Taste</small></div><p>Note : <span>We provide good quality, clean, organic produce.</span></p></article>
<section class="write-review"><label>Rate &amp; Review :</label><div class="review-stars"><button v-for="star in 5" :key="star" type="button" :aria-label="`Rate ${star} stars`" :aria-pressed="reviewRating === star" :class="{ active: star <= reviewRating }" @click="reviewRating = star">&#9733;</button></div><div v-if="reviewImage" class="review-image-preview"><img :src="reviewImage" alt="Review attachment preview" /><button type="button" aria-label="Remove attached picture" @click="reviewImage = ''"><FontAwesomeIcon :icon="faXmark" /></button></div><form @submit.prevent="submitReview"><input v-model="reviewText" placeholder="Write a review..." aria-label="Write a review" required /><button class="review-image-button" type="button" aria-label="Add picture" @click="reviewImageInput?.click()"><FontAwesomeIcon :icon="faImage" /></button><input ref="reviewImageInput" class="review-image-input" type="file" accept="image/*" aria-label="Choose a review picture" @change="chooseReviewImage" /><button class="review-submit" type="submit" aria-label="Submit review"><FontAwesomeIcon :icon="faArrowUp" /></button></form><p v-if="reviewMessage" role="status">{{ reviewMessage }}</p></section>
        </aside></div>
      </section><section v-else class="product-loading"><h1>Product not found</h1><button @click="router.push('/browse')">Back to browse</button></section>
    </div>
  </main>
</template>

<style scoped>
.product-page{min-height:100vh;background:#fff;color:#080808;font-family:Arial,sans-serif}.product-header{height:110px;background:#35423c;display:flex;align-items:center;padding:0 24px;gap:4vw}.product-logo{font:38px 'DM Mono',monospace;color:#a4b7ad;letter-spacing:.08em;border:0;background:none;cursor:pointer}.product-search{height:52px;max-width:655px;flex:1;background:#727875;border-radius:8px;display:flex;align-items:center;padding:0 20px;gap:12px}.product-search input{border:0;outline:0;background:transparent;width:100%;font-size:16px}.farmer-link{border:0;background:none;color:#fff;text-decoration:underline;font:16px 'DM Mono',monospace;white-space:nowrap;cursor:pointer}.product-filter,.product-profile{border:0;background:none;font-size:35px;cursor:pointer}.product-profile{margin-left:2vw}.product-profile img{width:38px;height:38px;display:block;border-radius:50%;object-fit:cover}.product-layout{display:grid;grid-template-columns:58px 1fr;min-height:calc(100vh - 110px)}.product-sidebar{display:flex;flex-direction:column;align-items:center;gap:36px;padding-top:24px}.product-sidebar button{border:0;background:none;font-size:35px;cursor:pointer}.product-content{position:relative;padding:36px clamp(20px,4vw,60px) 50px 40px}.product-back{position:absolute;top:12px;left:8px;border:0;background:none;font-size:36px;cursor:pointer}.product-main{display:grid;grid-template-columns:minmax(0,2.6fr) minmax(260px,.9fr);gap:38px;margin-left:45px}.product-left{min-width:0}.product-intro{min-height:164px;background:#e8f4ee;border:1px solid #111;border-radius:7px;padding:18px 22px;display:flex;justify-content:space-between;gap:22px}.product-intro h1{font-size:36px;font-weight:400;margin:0 0 3px}.product-intro p{font-size:19px;line-height:1.45;margin:0}.product-state{display:flex;align-items:flex-start;gap:22px;white-space:nowrap}.product-state button{border:0;background:none;font-size:24px;cursor:pointer}.product-state em{color:#28764e}.product-image{width:100%;height:clamp(260px,28vw,420px);object-fit:cover;margin-top:16px;border-radius:6px 6px 0 0}.product-facts{border:1px solid #111;padding:16px 18px}.product-facts p{margin:6px 0 16px}.product-facts p:first-child span{margin-left:36px}.reviews{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:16px}.review-rating h2{font-size:20px;margin:0}.review-rating>strong{color:#111}.review-rating>span{margin-left:10px;font-size:13px}.review-rating p{margin:6px 0}.rating-row{display:flex;align-items:center;gap:8px;font-size:11px;margin:6px 0}.rating-row i{height:12px;flex:1;border:1px solid #111;border-radius:8px;overflow:hidden}.rating-row b{display:block;height:100%;background:#ddd}.rating-row small{color:#45f}.review-card{border:1px solid #111;padding:12px;min-height:150px;font:14px Georgia,serif}.review-card svg{margin-right:8px}.review-card strong{display:block;margin-top:8px}.review-card p{line-height:1.3}.product-right{min-width:0}.buy-request-form{background:#eee8e8;border:1px solid #111;border-radius:7px;padding:16px;display:grid;gap:9px}.buy-request-form h2{font-size:20px;margin:0}.buy-request-form>small{font:italic 11px Georgia,serif;margin-top:-8px}.buy-request-form label{display:grid;gap:5px;font:13px Georgia,serif}.buy-request-form input,.buy-request-form textarea{width:100%;height:36px;border:1px solid #111;background:#fff;padding:7px}.buy-request-form textarea{height:100px;resize:vertical}.buy-request-form>div{display:flex;justify-content:space-between;margin-top:10px}.buy-request-form button{border:1px solid #111;border-radius:5px;padding:7px 16px;background:#ddd;cursor:pointer}.buy-request-form button[type=submit]{background:#197047;color:#fff}.buy-request-form p{font-size:12px;margin:0;color:#28764e}.seller-card{margin-top:12px;border:1px solid #111;border-radius:7px;padding:14px;display:grid;grid-template-columns:32px 1fr;gap:10px}.seller-avatar{width:30px;height:30px;border-radius:50%;background:#d5d3d3;display:grid;place-items:center;font-size:12px}.seller-card strong,.seller-card small{display:block}.seller-card small{font-size:10px;margin-top:4px;color:#555}.seller-card p{grid-column:1/-1;display:flex;gap:10px;font-size:12px}.seller-card p span{border:1px solid #111;background:#eee;padding:8px;flex:1}.seller-card a{grid-column:1/-1;text-decoration:underline;font-size:12px}.seller-card a svg{margin-left:12px}.write-review{margin-top:24px}.write-review>div{font-size:28px}.write-review form{display:flex;align-items:center;gap:12px;margin-top:16px}.write-review input{height:38px;flex:1;min-width:0;border:1px solid #111;border-radius:6px;padding:0 10px}.write-review button{border:0;background:none;font-size:22px}.product-loading{padding:50px;font-size:20px}
@media(max-width:950px){.product-header{gap:16px;padding:0 16px}.product-main{grid-template-columns:minmax(0,1.7fr) minmax(240px,.9fr);gap:18px;margin-left:24px}.reviews{grid-template-columns:1fr 1fr}.review-rating{grid-column:1/-1}.product-intro{flex-direction:column}.product-state{justify-content:space-between}.product-image{height:32vw}}
@media(max-width:650px){.product-header{height:auto;min-height:78px;flex-wrap:wrap;padding:12px}.product-logo{font-size:27px}.product-search{order:4;flex-basis:100%;height:44px}.farmer-link{margin-left:auto;font-size:13px}.product-layout{grid-template-columns:48px 1fr}.product-sidebar{gap:24px}.product-sidebar button{font-size:29px}.product-content{padding:30px 12px}.product-back{left:4px}.product-main{grid-template-columns:1fr;margin:20px 0 0;gap:20px}.product-intro{min-height:0;padding:14px}.product-intro h1{font-size:28px}.product-intro p{font-size:15px}.product-image{height:60vw}.reviews{grid-template-columns:1fr 1fr}.product-right{display:grid;gap:12px}.buy-request-form{order:0}.seller-card{order:1}.write-review{order:2;margin-top:4px}}
.review-stars{display:flex;align-items:center;gap:2px}.review-stars button{padding:0;color:#aaa;cursor:pointer}.review-stars button.active{color:#111}.write-review form button{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#111;color:#fff;cursor:pointer}.write-review>p{margin:8px 0;color:#28764e;font-size:12px}.user-review{overflow-wrap:anywhere}.review-image-input{display:none!important}.review-image-preview{position:relative;width:max-content;max-width:100%;margin:10px 0}.review-image-preview img{display:block;max-width:180px;max-height:140px;object-fit:contain;border:1px solid #aaa;border-radius:5px}.review-image-preview button{position:absolute;top:4px;right:4px;width:26px;height:26px;border:0;border-radius:50%;background:#111;color:#fff;display:grid;place-items:center;cursor:pointer}.review-attachment{display:block;max-width:100%;max-height:180px;margin:8px 0;object-fit:contain;border-radius:5px}.write-review form{display:grid;grid-template-columns:minmax(0,1fr) 38px;gap:14px;position:relative;align-items:center}.write-review form input:not([type=file]){height:46px;border-radius:12px;padding:0 52px 0 14px}.write-review form .review-image-button{grid-column:2;grid-row:1;width:38px;height:38px;padding:0;border:0;border-radius:0;background:transparent;color:#080808;font-size:28px}.write-review form .review-submit{position:absolute;right:61px;top:50%;transform:translateY(-50%);width:30px;height:30px;padding:0;border:0;border-radius:50%;background:#000;color:#fff;font-size:16px}.product-header{height:110px;gap:5vw}.product-logo{font:38px 'DM Mono',monospace;color:#a4b7ad;letter-spacing:.08em;background:none;border:0;cursor:pointer}.product-search{height:52px;max-width:655px;flex:1;background:#727875;border-radius:8px;display:flex;align-items:center;padding:0 20px;gap:12px;font-size:30px}.product-filter,.product-profile{margin-left:auto;background:none;border:0;color:#050706;font-size:42px;cursor:pointer}.product-profile{font-size:38px;margin-left:3vw}.product-profile img{width:38px;height:38px;display:block;border-radius:50%;object-fit:cover}@media(max-width:760px){.product-header{height:82px;min-height:82px;padding:0 16px;gap:16px;flex-wrap:nowrap}.product-logo{font-size:28px}.product-search{height:44px}.product-filter,.product-profile{font-size:31px}.product-profile{margin-left:3vw}.farmer-link{font-size:13px}}@media(max-width:560px){.product-header{height:auto;min-height:0;flex-wrap:wrap;padding:14px;gap:12px}.product-logo{font-size:24px}.product-search{order:3;flex-basis:100%;height:44px}.product-filter,.product-profile{font-size:30px}.product-profile{margin-left:auto}}</style>
