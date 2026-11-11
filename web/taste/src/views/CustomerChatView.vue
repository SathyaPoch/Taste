<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faMagnifyingGlass, faSliders, faUser, faList, faMessage, faClockRotateLeft, faBookmark, faArrowUp, faImage, faCamera, faXmark } from '@fortawesome/free-solid-svg-icons'
import { getProfileAvatar } from '../services/profileAvatar'

const router = useRouter()
const avatarUrl = getProfileAvatar()
type ChatUser = { id: string; name: string; role: string }
const signedInUser = JSON.parse(localStorage.getItem('taste-user') ?? '{}') as Partial<ChatUser>
const currentUser: ChatUser = { id: signedInUser.id ?? 'guest', name: signedInUser.name ?? 'Customer', role: signedInUser.role ?? 'customer' }
const farmerUser: ChatUser = { id: 'fmr-001', name: 'H : Farmer', role: 'farmer' }
const customerUser: ChatUser = { id: 'usr-003', name: 'New Customer', role: 'customer' }
const peerUser = currentUser.role === 'farmer' ? customerUser : farmerUser
const conversationKey = `taste-chat-${[currentUser.id, peerUser.id].sort().join('-')}`
type ChatMessage = { text: string; senderId: string }
function loadConversation(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(conversationKey)
    if (saved) return JSON.parse(saved) as ChatMessage[]
  } catch {
    localStorage.removeItem(conversationKey)
  }
  return [{ text: `Hello, this is ${peerUser.name}. How can I help you?`, senderId: peerUser.id }]
}
const conversations = [
  { id: 1, name: peerUser.name, preview: 'Start a conversation' },
  ...Array.from({ length: 15 }, (_, index) => ({ id: index + 2, name: `User ${String.fromCharCode(65 + index % 6)}`, preview: 'I am interested in your produce.' })),
]
const selected = ref(1)
const draft = ref('')
const messageHistories = ref<Record<number, ChatMessage[]>>(Object.fromEntries(conversations.map((chat) => [chat.id, chat.id === 1
  ? loadConversation()
  : [
      { text: `Hello, this is ${chat.name}. How can I help you?`, senderId: `mock-user-${chat.id}` },
      { text: 'I am interested in your produce.', senderId: `mock-user-${chat.id}` },
    ],
])))
function syncConversation(event: StorageEvent) {
  if (event.key !== conversationKey) return
  try {
    messageHistories.value[1] = event.newValue ? JSON.parse(event.newValue) as ChatMessage[] : []
  } catch {
    messageHistories.value[1] = []
  }
}
onMounted(() => window.addEventListener('storage', syncConversation))
onBeforeUnmount(() => window.removeEventListener('storage', syncConversation))
const searchOpen = ref(false)
const chatSearch = ref('')
const listOpen = ref(false)
const searchInput = ref<HTMLInputElement | null>(null)
async function openChatSearch() {
  searchOpen.value = true
  await nextTick()
  searchInput.value?.focus()
}
const visibleMessages = computed(() => (messageHistories.value[selected.value] ?? []).filter((message) => message.text.toLowerCase().includes(chatSearch.value.toLowerCase())).map((message) => ({ ...message, direction: message.senderId === currentUser.id ? 'outgoing' : 'incoming' })))
function highlightedMessage(message: string) {
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!)
  const query = chatSearch.value.trim()
  const safeMessage = escapeHtml(message)
  if (!query) return safeMessage
  const safeQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return safeMessage.replace(new RegExp(`(${safeQuery})`, 'gi'), '<mark>$1</mark>')
}
function previewFor(id: number) {
  const history = messageHistories.value[id]
  return history?.[history.length - 1]?.text ?? conversations.find((chat) => chat.id === id)?.preview ?? ''
}
function sendMessage() {
  const message = draft.value.trim()
  if (!message) return
  const history = messageHistories.value[selected.value] ?? (messageHistories.value[selected.value] = [])
  history.push({ text: message, senderId: currentUser.id })
  if (selected.value === 1) localStorage.setItem(conversationKey, JSON.stringify(history))
  draft.value = ''
}
</script>

<template>
  <main class="chat-page">
    <header class="customer-header"><button class="customer-logo" @click="router.push('/browse')">Taste</button><label class="customer-search"><FontAwesomeIcon :icon="faMagnifyingGlass" aria-hidden="true" /><input placeholder="Search for your products" /></label><button v-if="signedInUser.role === 'farmer'" class="farmer-portal-link" @click="router.push('/farmer-portal')">Farmer Portal</button><button class="customer-icon" aria-label="Filters" @click="router.push('/browse')"><FontAwesomeIcon :icon="faSliders" /></button><button class="customer-profile" aria-label="User account" @click="router.push('/account')"><img v-if="avatarUrl" :src="avatarUrl" alt="Profile picture" /><FontAwesomeIcon v-else :icon="faUser" /></button></header>
    <section class="chat-layout">
      <aside class="chat-sidebar" aria-label="Browse navigation"><button aria-label="Listings" @click="router.push('/browse')"><FontAwesomeIcon :icon="faList" /></button><button class="active" aria-label="Messages"><FontAwesomeIcon :icon="faMessage" /></button><button aria-label="History" @click="router.push('/history')"><FontAwesomeIcon :icon="faClockRotateLeft" /></button><button aria-label="Saved listings" @click="router.push('/saved')"><FontAwesomeIcon :icon="faBookmark" /></button></aside>
      <nav class="conversation-list" :class="{ 'mobile-open': listOpen }" aria-label="Conversations"><button v-for="chat in conversations" :key="chat.id" :class="{ selected: selected === chat.id }" @click="selected = chat.id; listOpen = false"><span class="person-icon"><FontAwesomeIcon :icon="faUser" /></span><span><strong>{{ chat.name }}</strong><small>{{ previewFor(chat.id) }}</small></span></button></nav>
      <section class="conversation" aria-label="Chat conversation">
        <header class="conversation-header"><button class="mobile-list-toggle" aria-label="Show conversations" @click="listOpen = !listOpen"><FontAwesomeIcon :icon="faList" /></button><span class="person-icon"><FontAwesomeIcon :icon="faUser" /></span><div><strong>{{ conversations.find((chat) => chat.id === selected)?.name }}</strong><small>Phnom Penh, Cambodia</small><small>This is a bio. A random bio for users</small></div><button v-if="!searchOpen" aria-label="Search conversation" @click="openChatSearch"><FontAwesomeIcon :icon="faMagnifyingGlass" /></button><input v-else ref="searchInput" v-model="chatSearch" class="chat-search-input" placeholder="Search this chat" aria-label="Search messages" /><button v-if="searchOpen" aria-label="Close search" @click="searchOpen = false; chatSearch = ''"><FontAwesomeIcon :icon="faXmark" /></button></header>
        <div class="messages"><p v-for="(message, index) in visibleMessages" :key="`${selected}-${index}`" class="message" :class="message.direction" v-html="highlightedMessage(message.text)"></p></div>
        <form class="composer" @submit.prevent="sendMessage"><span class="person-icon composer-avatar" :class="{ 'has-photo': avatarUrl }"><img v-if="avatarUrl" :src="avatarUrl" alt="Your profile picture" /><FontAwesomeIcon v-else :icon="faUser" /></span><input v-model="draft" placeholder="Typing..." aria-label="Write a message" /><button class="send-button" aria-label="Send message"><FontAwesomeIcon :icon="faArrowUp" /></button><label class="attachment-button" aria-label="Attach image"><FontAwesomeIcon :icon="faImage" /><input type="file" accept="image/*" hidden /></label><label class="attachment-button video-upload" aria-label="Upload video"><FontAwesomeIcon :icon="faCamera" /><input type="file" accept="video/*" hidden /></label></form>
      </section>
    </section>
  </main>
</template>

<style scoped>
.chat-page{height:100vh;display:flex;flex-direction:column;background:#fff;font-family:Arial,sans-serif;color:#080808}.customer-header{height:110px;flex:none;background:#35423c;display:flex;align-items:center;padding:0 24px;gap:5vw}.customer-logo{font:38px 'DM Mono',monospace;color:#a4b7ad;letter-spacing:.08em;background:none;border:0;cursor:pointer}.customer-search{height:52px;max-width:655px;flex:1;background:#727875;border-radius:8px;display:flex;align-items:center;padding:0 20px;gap:12px;font-size:30px}.customer-search input{border:0;outline:0;background:transparent;width:100%;font-size:16px}.customer-icon,.customer-profile{margin-left:auto;background:none;border:0;font-size:42px;cursor:pointer}.customer-profile{font-size:38px;margin-left:3vw}.chat-layout{display:grid;grid-template-columns:70px minmax(260px,29%) 1fr;flex:1;min-height:0}.chat-sidebar{border-right:1px solid #111;display:flex;flex-direction:column;align-items:center;gap:28px;padding-top:24px}.chat-sidebar button{border:0;background:none;font-size:35px;cursor:pointer}.chat-sidebar button.active{color:#34734f}.conversation-list{overflow:auto;background:#f2f2f2;border-right:1px solid #111}.conversation-list button{width:100%;min-height:120px;border:0;border-bottom:1px solid #aaa;display:flex;align-items:center;gap:18px;text-align:left;padding:18px;background:#f2f2f2;cursor:pointer}.conversation-list button.selected{background:#d5d3d3;border:1px solid #111}.person-icon{width:46px;height:46px;display:inline-flex;align-items:center;justify-content:center;background:#000;color:#000;border-radius:50%;font-size:0;flex:none;position:relative}.person-icon:after{content:'';position:absolute;top:32px;width:46px;height:19px;background:#000;border-radius:30px 30px 5px 5px}.conversation-list strong,.conversation-list small{display:block}.conversation-list strong{font:23px 'DM Mono',monospace;margin-bottom:5px}.conversation-list small{font:18px Georgia,serif}.conversation{display:flex;flex-direction:column;min-width:0;min-height:0}.conversation-header{height:120px;flex:none;background:#d5d3d3;border:1px solid #111;display:flex;align-items:center;gap:22px;padding:18px 28px}.conversation-header strong,.conversation-header small{display:block}.conversation-header strong{font:23px 'DM Mono',monospace}.conversation-header small{font-size:13px;margin-top:4px}.conversation-header button{margin-left:auto;border:0;background:none;font-size:38px}.messages{position:relative;flex:1;overflow:auto;padding:48px 7%}.message{background:#d5d3d3;border:1px solid #111;padding:10px;margin:0;font-size:15px;line-height:1.25}.message.long{max-width:590px;margin:0 0 18px 6%}.incoming-row{display:flex;align-items:center;gap:16px}.incoming-row .message{max-width:280px}.outgoing-messages{display:flex;flex-direction:column;align-items:flex-end;gap:6px;margin-top:38px}.outgoing{min-width:240px;text-align:center}.composer{min-height:90px;border-top:1px solid #111;display:flex;align-items:center;gap:20px;padding:14px 24px}.composer input{height:52px;flex:1;min-width:0;border:1px solid #111;border-radius:28px;background:#eee;padding:0 22px;font-size:20px}.composer button,.attachment-button{border:0;background:none;font-size:24px;cursor:pointer}.composer .send-button{position:absolute;right:197px;background:#000;color:white;border-radius:50%;width:26px;height:26px;font-size:17px}.composer{position:relative}@media(max-width:760px){.customer-header{height:82px;padding:0 14px;gap:16px}.customer-logo{font-size:27px}.customer-search{height:44px}.customer-icon,.customer-profile{font-size:30px}.chat-layout{grid-template-columns:48px 1fr}.conversation-list{display:none}.conversation-header{height:88px;padding:12px}.messages{padding:28px 12px}.message.long{margin-left:0}.composer{gap:10px;padding:10px}.composer .send-button{right:108px}}@media(max-width:420px){.customer-header{flex-wrap:wrap;height:auto;padding:12px}.customer-search{order:4;flex-basis:100%}.conversation-header small:last-child{display:none}.composer button[aria-label="Take photo"]{display:none}}
.conversation-list{overflow-y:auto;scrollbar-width:thin;scrollbar-color:#777 #eee}.conversation-list::-webkit-scrollbar{width:12px}.conversation-list::-webkit-scrollbar-thumb{background:#777;border-radius:8px}.conversation-header .mobile-list-toggle{display:none}.chat-search-input{margin-left:auto;max-width:220px;min-width:100px;border:1px solid #888;border-radius:6px;padding:9px}.messages{display:flex;flex-direction:column;gap:14px}.messages .incoming{align-self:flex-start;max-width:min(75%,710px)}.messages .outgoing{align-self:flex-end;max-width:75%}.messages .outgoing{background:#2478d4;color:#fff;border-color:#1764b6}.messages mark{background:#ffdf55;color:inherit;border-radius:2px}.video-upload{cursor:pointer}@media(max-width:760px){.chat-layout{position:relative}.conversation-list{display:none;position:absolute;z-index:3;inset:0 0 0 48px;box-shadow:0 0 0 999px #0003}.conversation-list.mobile-open{display:block}.conversation-header .mobile-list-toggle{display:block;margin:0;font-size:25px}}
.composer .send-button{right:145px}
@media(max-width:760px){.composer .send-button{right:116px}}
.customer-profile img{display:block;width:38px;height:38px;border-radius:50%;object-fit:cover}@media(max-width:900px){.customer-profile img{width:32px;height:32px}}.chat-layout{grid-template-columns:58px minmax(260px,29%) 1fr}.chat-sidebar{gap:36px;border-right:0}.chat-sidebar button{font-size:35px}.farmer-portal-link{border:0;background:none;color:#fff;text-decoration:underline;font:16px 'DM Mono',monospace;white-space:nowrap;cursor:pointer}@media(max-width:900px){.farmer-portal-link{font-size:13px}}.composer-avatar{width:58px;height:58px;overflow:hidden;flex:none}.composer-avatar:after{display:none}.composer-avatar:not(.has-photo){background:transparent;color:#000;border-radius:0;font-size:42px}.composer-avatar.has-photo{background:transparent;border-radius:50%}.composer-avatar img{display:block;width:100%;height:100%;object-fit:cover;border-radius:50%}</style>
