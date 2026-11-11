<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faSliders, faUser, faList, faMessage, faClockRotateLeft, faBookmark } from '@fortawesome/free-solid-svg-icons'
import { getProfileAvatar, profileAvatarKey } from '../services/profileAvatar'

const router = useRouter()
const savedUser = localStorage.getItem('taste-user')
const user = savedUser ? JSON.parse(savedUser) as { id?: string; name?: string; email?: string; phone?: string; role?: string } : {}
const isFarmer = user.role === 'farmer'
const farmerVerification = JSON.parse(localStorage.getItem('taste-farmer-verification') ?? '{}') as { firstName?: string; lastName?: string; email?: string; farmLocation?: string; businessName?: string; userId?: string; documents?: string[] }
const names = (user.name ?? '').split(' ')
const firstName = ref(farmerVerification.firstName || names[0] || 'John')
const lastName = ref(farmerVerification.lastName || names.slice(1).join(' ') || 'John')
const email = ref(farmerVerification.email || user.email || '')
const phone = ref(user.phone || '+855 12 345 678')
const location = ref(farmerVerification.farmLocation || 'Phnom Penh, Phnom Penh, Cambodia')
const bio = ref('Hello, This is John John!')
const businessName = ref(farmerVerification.businessName ?? '')
const farmerUserId = ref(farmerVerification.userId ?? user.id ?? '')
const farmerDocuments = ref(farmerVerification.documents ?? [])
const message = ref('')
const avatarInput = ref<HTMLInputElement | null>(null)
const avatarUrl = ref(getProfileAvatar())
const displayName = computed(() => `${firstName.value} ${lastName.value}`.trim())
function chooseAvatar(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) { message.value = 'Choose an image file.'; return }
  const reader = new FileReader()
  reader.onload = () => {
    if (typeof reader.result !== 'string') return
    avatarUrl.value = reader.result
    localStorage.setItem(profileAvatarKey(), reader.result)
    message.value = 'Profile picture updated.'
  }
  reader.readAsDataURL(file)
}
function updateProfile() {
  localStorage.setItem('taste-customer-profile', JSON.stringify({ name: displayName.value, email: email.value, phone: phone.value, location: location.value, bio: bio.value, businessName: businessName.value, userId: farmerUserId.value }))
  if (isFarmer) {
    const verification = JSON.parse(localStorage.getItem('taste-farmer-verification') ?? '{}')
    localStorage.setItem('taste-farmer-verification', JSON.stringify({ ...verification, firstName: firstName.value, lastName: lastName.value, email: email.value, farmLocation: location.value, businessName: businessName.value, userId: farmerUserId.value }))
  }
  message.value = 'Profile updated.'
}
function logout() {
  localStorage.removeItem('taste-user')
  router.push('/login')
}
</script>

<template>
  <main class="account-page">
    <header class="customer-header"><button type="button" class="customer-logo" aria-label="Back to browsing" @click="router.push('/browse')">Taste</button><label class="customer-search"><FontAwesomeIcon :icon="faMagnifyingGlass" aria-hidden="true" /><input placeholder="Search for your products" /></label><button type="button" class="customer-icon" aria-label="Filters" @click="router.push('/browse')"><FontAwesomeIcon :icon="faSliders" /></button><span class="customer-profile" aria-label="User account"><img v-if="avatarUrl" :src="avatarUrl" alt="Profile picture" /><FontAwesomeIcon v-else :icon="faUser" /></span></header>
    <aside class="account-sidebar" aria-label="Account navigation"><button aria-label="Listings" @click="router.push('/browse')"><FontAwesomeIcon :icon="faList" /></button><button aria-label="Messages" @click="router.push('/messages')"><FontAwesomeIcon :icon="faMessage" /></button><button aria-label="History" @click="router.push('/history')"><FontAwesomeIcon :icon="faClockRotateLeft" /></button><button aria-label="Saved listings" @click="router.push('/saved')"><FontAwesomeIcon :icon="faBookmark" /></button></aside>
    <form class="account-form" @submit.prevent="updateProfile">
      <section class="avatar-column"><div class="avatar" :class="{ 'has-photo': avatarUrl }" :style="avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined" role="img" aria-label="Profile avatar"></div><input ref="avatarInput" class="avatar-file" type="file" accept="image/*" aria-label="Choose profile picture" @change="chooseAvatar" /><button type="button" class="edit-avatar" @click="avatarInput?.click()">Edit picture</button></section>
      <div class="profile-fields">
        <label><span>Name<span class="required">*</span></span><div class="name-inputs"><span><input v-model="firstName" /><small>First Name</small></span><span><input v-model="lastName" /><small>Last Name</small></span></div></label>
        <label v-if="!isFarmer"><span>Phone Number<span class="required">*</span></span><input v-model="phone" type="tel" required /></label>
        <label>E-mail(Optional)<input v-model="email" type="email" /></label>
        <label><span>Location<span class="required">*</span></span><input v-model="location" required /></label>
        <label class="bio-field">Bio<textarea v-model="bio" maxlength="150" /></label>
        <section v-if="isFarmer" class="farmer-account-details"><h2>Business Details</h2><label>Business/Farm Name<input v-model="businessName" /></label><label>Regional Area/Location of the Primary Farm<input v-model="location" /></label><label>User ID<input v-model="farmerUserId" /></label><p><strong>Verification documents</strong><span>{{ farmerDocuments.length ? farmerDocuments.join(', ') : 'No documents uploaded' }}</span></p></section>
        <button class="update-button" type="submit">Update profile</button><p v-if="message" role="status">{{ message }}</p>
      </div>
      <div class="account-actions"><button type="button" class="delete-button">DELETE ACCOUNT</button><button type="button" class="logout-button" @click="logout">Log Out</button></div>
    </form>
  </main>
</template>

<style scoped>
.account-page{min-height:calc(100vh - 110px);display:grid;grid-template-columns:56px 1fr;background:white;font:18px Arial,sans-serif}.account-sidebar{display:flex;flex-direction:column;align-items:center;gap:24px;padding-top:24px}.account-sidebar button{border:0;background:none;font-size:32px}.account-form{padding:70px 4vw 80px 8vw;display:grid;grid-template-columns:260px 1fr;gap:36px;position:relative}.avatar-column{position:relative;display:flex;justify-content:center}.avatar-file{display:none}.avatar.has-photo{background-color:#fff;background-size:cover;background-position:center}.avatar.has-photo:after{display:none}.avatar{width:190px;height:190px;border:0;outline:0;background:#000;color:#000;border-radius:50%;font-size:0;position:relative}.avatar:after{content:'';position:absolute;top:130px;left:-48px;width:286px;height:100px;border-radius:150px 150px 12px 12px;background:#000}.edit-avatar{position:absolute;top:160px;right:-4px;background:#fff;border:1px solid #111;padding:5px 12px;z-index:1}.profile-fields{display:grid;grid-template-columns:1fr 1fr;gap:20px 28px;align-content:start}.profile-fields>label{display:grid;gap:8px}.profile-fields input{height:44px;border:1px solid #111;border-radius:7px;padding:0 12px;min-width:0}.name-inputs{display:grid;grid-template-columns:1fr 1fr;gap:24px}.name-inputs span{display:grid;gap:4px}.name-inputs small{color:#666;font-size:14px}.required{display:inline;color:#c33}.bio-field{grid-column:1/-1;margin:20px 0 0 0;max-width:800px}.profile-fields textarea{height:145px;min-height:145px;max-height:145px;resize:none;border:1px solid #111;border-radius:3px;padding:14px;font:16px Arial;box-shadow:0 2px 4px #0003}.update-button{justify-self:start;background:#1689e5;color:#fff;border:0;border-radius:7px;padding:12px 20px}.account-actions{position:absolute;right:5vw;bottom:34px;display:flex;gap:60px}.account-actions button{border:1px solid #111;border-radius:8px;padding:12px 16px;background:white}.account-actions .delete-button{background:#cf3e3e;color:#fff;border:0}.account-actions .logout-button{min-width:96px}.account-fields p{margin:0}@media(max-width:850px){.account-form{padding:35px 24px 110px;grid-template-columns:180px 1fr;gap:24px}.avatar{transform:scale(.7);transform-origin:top center}.profile-fields{grid-template-columns:1fr}.bio-field{grid-column:auto}.account-actions{gap:16px}}@media(max-width:560px){.account-page{grid-template-columns:38px 1fr}.account-form{display:flex;flex-direction:column;padding:24px 16px 120px}.avatar-column{height:150px}.avatar{transform:scale(.55)}.edit-avatar{top:95px;right:15%}.profile-fields{display:grid;grid-template-columns:1fr}.account-actions{left:16px;right:16px;justify-content:space-between}.name-inputs{gap:12px}}
.customer-header{grid-column:1/-1;height:110px;background:#35423c;display:flex;align-items:center;padding:0 24px;gap:5vw;margin:-0px 0 0}.customer-logo{border:0;background:none;padding:0;cursor:pointer;font:38px 'DM Mono',monospace;color:#a4b7ad;letter-spacing:.08em}.customer-search{height:52px;max-width:655px;flex:1;background:#727875;border-radius:8px;display:flex;align-items:center;padding:0 20px;gap:12px;font-size:30px}.customer-search input{border:0;outline:0;background:transparent;width:100%;font-size:16px;color:#111}.customer-icon,.customer-profile{margin-left:auto;background:none;border:0;color:#050706;font-size:42px;line-height:1}.customer-icon{cursor:pointer}.customer-profile{font-size:38px;margin-left:3vw}@media(max-width:850px){.customer-header{height:82px;padding:0 16px;gap:18px}.customer-logo{font-size:28px}.customer-search{height:44px}.customer-icon,.customer-profile{font-size:32px}}@media(max-width:560px){.customer-header{flex-wrap:wrap;height:auto;padding:14px;gap:12px}.customer-logo{font-size:24px}.customer-search{order:3;flex-basis:100%}}
/* Keep the account navigation beside the form directly below the full-width header. */
.account-page{position:relative}.account-page>.customer-header{grid-column:1/-1}.account-sidebar{position:absolute;top:134px;left:0;grid-column:auto;grid-row:auto;padding-top:0}.account-form{grid-column:2;grid-row:2}
.account-page{grid-template-columns:58px 1fr}.account-sidebar{width:58px;align-items:center;gap:36px;border-right:0}.account-sidebar button{font-size:35px}
@media(max-width:850px){.account-sidebar{top:106px}}
.customer-profile img{display:block;width:38px;height:38px;border-radius:50%;object-fit:cover}
.farmer-account-details{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:16px 24px;margin-top:8px}.farmer-account-details h2{grid-column:1/-1;margin:0;font-size:20px;font-weight:400}.farmer-account-details label{display:grid;gap:8px}.farmer-account-details input{height:44px;border:1px solid #111;border-radius:7px;padding:0 12px}.farmer-account-details p{display:grid;gap:8px;grid-column:1/-1;margin:0}.farmer-account-details p span{font-size:14px;color:#555}@media(max-width:850px){.farmer-account-details{grid-template-columns:1fr}.farmer-account-details h2,.farmer-account-details p{grid-column:auto}}
</style>
