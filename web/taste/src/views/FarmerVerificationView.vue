<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faSliders, faUser, faXmark, faCloudArrowUp } from '@fortawesome/free-solid-svg-icons'

const router = useRouter()
const files = ref<File[]>([])
const message = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
function acceptFiles(chosen: File[]) {
  const valid = chosen.filter((file) => /\.(pdf|png|jpe?g)$/i.test(file.name) && file.size <= 10 * 1024 * 1024)
  files.value = [...files.value, ...valid]
  message.value = valid.length === chosen.length ? '' : 'Files must be PDF, PNG, or JPG and no larger than 10 MB.'
}
function addFiles(event: Event) {
  const input = event.target as HTMLInputElement
  acceptFiles(Array.from(input.files ?? []))
  input.value = ''
}
function dropFiles(event: DragEvent) { event.preventDefault(); acceptFiles(Array.from(event.dataTransfer?.files ?? [])) }
function submitRequest(event: Event) {
  const form = event.target as HTMLFormElement
  const currentUser = JSON.parse(localStorage.getItem('taste-user') ?? '{}') as { id?: string }
  const flaggedUsers = JSON.parse(localStorage.getItem('taste-flagged-users') ?? '[]') as string[]
  if (currentUser.id && flaggedUsers.includes(currentUser.id)) {
    message.value = 'Your account is flagged and cannot submit a farmer verification request.'
    return
  }
  if (!form.reportValidity()) return
  if (!files.value.length) { message.value = 'Upload at least one certification document.'; return }
  const data = Object.fromEntries(new FormData(form).entries())
  localStorage.setItem('taste-farmer-verification', JSON.stringify({ ...data, documents: files.value.map((file) => file.name), submittedAt: new Date().toISOString() }))
  message.value = 'Your verification request has been submitted.'
  form.reset()
  files.value = []
  router.push('/browse')
}
</script>

<template>
  <main class="verification-page">
    <header class="customer-header"><button class="customer-logo" @click="router.push('/browse')">Taste</button><label class="customer-search"><FontAwesomeIcon :icon="faMagnifyingGlass" aria-hidden="true" /><input placeholder="Search for your products" /></label><button class="customer-icon" aria-label="Filters" @click="router.push('/browse')"><FontAwesomeIcon :icon="faSliders" /></button><button class="customer-profile" aria-label="User account" @click="router.push('/account')"><FontAwesomeIcon :icon="faUser" /></button></header>
    <section class="verification-content"><button class="close-button" aria-label="Close" @click="router.push('/browse')"><FontAwesomeIcon :icon="faXmark" /></button><h1>Request Farmer Verification</h1>
      <form @submit.prevent="submitRequest"><label class="field-label">Name</label><div class="name-fields"><label><input name="firstName" required /><small>First Name</small></label><label><input name="lastName" required /><small>Last Name</small></label></div><label class="email-field">E-mail(Optional)<input type="email" name="email" /></label>
        <fieldset><legend>Business Details</legend><div class="business-grid"><div class="business-fields"><label>Business/Farm Name<span>*</span><input name="businessName" required /></label><label>Regional Area/Location of the Primary Farm<span>*</span><input name="farmLocation" required /></label><label class="user-id">User ID<span>*</span><input name="userId" required /></label></div><div class="document-field"><label>National ID Card/Family Book or any certified docs<span>*</span></label><div class="upload-box" @dragover.prevent @drop="dropFiles"><input ref="fileInput" class="file-input" type="file" accept=".pdf,.png,.jpg,.jpeg" multiple @change="addFiles" /><strong><FontAwesomeIcon :icon="faCloudArrowUp" /></strong><span>Drag and drop the certifications or <button type="button" class="browse-files" @click="fileInput?.click()">browse files</button></span><small>Accepted formats: PDF, PNG, JPG (10MB max per file)</small><small v-if="files.length" class="uploaded-files">{{ files.map((file) => file.name).join(', ') }}</small><small v-if="message" class="upload-message">{{ message }}</small></div></div></div></fieldset>
        <div class="comments-row"><label class="comments-label">Additional Comments<textarea name="comments" maxlength="80"></textarea></label><div class="form-actions"><button type="button" class="cancel-button" @click="router.push('/browse')">Cancel</button><button class="submit-button" type="submit">Submit</button></div></div><p v-if="message" role="status">{{ message }}</p>
      </form>
    </section>
  </main>
</template>

<style scoped>
.business-fields label,.document-field>label:first-child{display:block}.business-fields label span,.document-field>label span{display:inline;color:#c33}.business-fields input,.document-field>label:first-child+div{margin-top:12px}
.verification-page{min-height:100vh;background:#fff;color:#080808;font-family:Arial,sans-serif}.customer-header{height:110px;background:#35423c;display:flex;align-items:center;padding:0 24px;gap:5vw}.customer-logo{font:38px 'DM Mono',monospace;color:#a4b7ad;letter-spacing:.08em;background:none;border:0;cursor:pointer}.customer-search{height:52px;max-width:655px;flex:1;background:#727875;border-radius:8px;display:flex;align-items:center;padding:0 20px;gap:12px;font-size:30px}.customer-search input{border:0;outline:0;background:transparent;width:100%;font-size:16px}.customer-icon,.customer-profile{margin-left:auto;background:none;border:0;font-size:42px;cursor:pointer}.customer-profile{font-size:38px;margin-left:3vw}.verification-content{position:relative;padding:22px 4vw 50px}.verification-content h1{font-size:34px;margin:0 0 4px}.close-button{position:absolute;right:25%;top:20px;border:0;background:none;font-size:36px;line-height:1;cursor:pointer}.verification-content form{max-width:950px}.field-label{display:block;font-size:21px;margin:0 0 12px}.name-fields{display:flex;gap:38px}.name-fields label{display:grid;gap:5px;width:207px}.name-fields input,.email-field input,.business-fields input{height:42px;border:1px solid #111;border-radius:7px;padding:0 10px}.name-fields small{color:#777}.email-field{display:grid;gap:5px;width:min(100%,360px);font-size:21px;margin:20px 0 4px}fieldset{border:1px solid #111;box-shadow:0 2px 3px #0002;padding:22px 32px 90px;margin:0}legend{font-size:21px;padding:0 5px}.business-grid{display:grid;grid-template-columns:1.1fr 1fr;gap:24px}.business-fields{display:grid;gap:12px;align-content:start}.business-fields label,.document-field>label:first-child{display:grid;gap:7px;font-size:19px}.business-fields label span,.document-field>label span{color:#c33}.business-fields input{width:100%}.business-fields .user-id input{max-width:188px}.upload-box{position:relative;height:232px;border:1px solid #555;border-radius:12px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:16px;cursor:pointer;text-align:center;padding:14px}.file-input{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}.browse-files{border:0;background:none;color:#28764e;text-decoration:underline;font:inherit;font-weight:bold;cursor:pointer}.upload-message{color:#c33}.uploaded-files{color:#0066ff!important;font-weight:600}.upload-box strong{font-size:28px}.upload-box span{font-size:14px}.upload-box u{color:#28764e;font-weight:bold}.upload-box small{font-size:10px;color:#666}.comments-label{display:grid;gap:8px;font-size:19px;margin-top:22px}.comments-row{display:flex;align-items:flex-end;gap:32px;margin-top:22px}.comments-label textarea{width:min(100%,584px);height:116px;min-height:116px;max-height:116px;resize:none;border:1px solid #111;box-shadow:0 2px 4px #0002;padding:10px;font:16px Arial}.form-actions{display:flex;gap:32px;margin:0 0 8px}.form-actions button{min-width:94px;padding:11px;border:1px solid #111;border-radius:6px;cursor:pointer}.cancel-button{background:#ddd}.submit-button{background:#5da47f;color:white}.verification-content form>p{margin-top:16px}@media(max-width:760px){.customer-header{height:82px;padding:0 16px;gap:16px}.customer-logo{font-size:28px}.customer-search{height:44px}.customer-icon,.customer-profile{font-size:31px}.verification-content{padding:24px 18px}.verification-content h1{font-size:27px;padding-right:36px}.close-button{right:16px;top:18px}.business-grid{grid-template-columns:1fr}fieldset{padding:16px 18px 24px}.comments-row{align-items:flex-start;flex-direction:column;gap:16px}.form-actions{margin:0;justify-content:flex-start;gap:18px}.upload-box{height:170px}}@media(max-width:500px){.customer-header{flex-wrap:wrap;height:auto;padding:12px}.customer-search{order:4;flex-basis:100%}.name-fields{gap:12px}.name-fields label{width:50%;min-width:0}.name-fields input{width:100%}}
.business-fields label,.document-field>label:first-child{display:block}.business-fields label span,.document-field>label:first-child span{display:inline;color:#c33}.business-fields label input{display:block;margin-top:12px}
</style>
