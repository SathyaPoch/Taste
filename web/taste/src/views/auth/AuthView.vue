<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const mode = computed(() => route.path === '/signup' ? 'signup' : route.path === '/forgot-password' ? 'reset' : 'login')
const phone = ref('+855 ')
const password = ref('')
const code = ref('')
const message = ref('')
const title = computed(() => mode.value === 'signup' ? 'Sign Up' : mode.value === 'reset' ? 'Forgot password' : 'Log In')
function submit() {
  message.value = ''
  if (mode.value === 'login') {
    if (!phone.value.trim() || !password.value) { message.value = 'Enter your phone number and password.'; return }
    localStorage.setItem('taste-user', phone.value)
    router.push('/')
  } else if (!/^\d{4}$/.test(code.value)) message.value = 'Enter the 4 digit verification code. Demo code: 1111.'
  else if (mode.value === 'reset' && password.value.length < 6) message.value = 'Choose a password with at least 6 characters.'
  else { localStorage.setItem('taste-user', phone.value); router.push('/') }
}
</script>

<template>
  <main class="auth-screen">
    <form class="auth-card" @submit.prevent="submit">
      <RouterLink class="auth-back" to="/">← Taste</RouterLink>
      <h1>{{ title }}</h1>
      <label>Enter Your Phone Number<input v-model="phone" type="tel" autocomplete="tel" required placeholder="+855 12 345 678" /></label>
      <template v-if="mode !== 'login'">
        <small class="sent-note">✉ Code sent to your phone · Demo code: 1111</small>
        <div class="code-heading"><span>Your Verification Code</span><span>Expires in 04:59</span></div>
        <input v-model="code" class="code-input" inputmode="numeric" maxlength="4" placeholder="— — — —" aria-label="4 digit verification code" />
      </template>
      <label>{{ mode === 'reset' ? 'New Password' : 'Password' }}<input v-model="password" type="password" :autocomplete="mode === 'login' ? 'current-password' : 'new-password'" :required="mode !== 'signup' || password.length > 0" :placeholder="mode === 'signup' ? 'Create a password (optional)' : ''" /></label>
      <button class="auth-submit" type="submit">{{ mode === 'login' ? 'Sign In' : mode === 'reset' ? 'Verify & Sign In' : 'Verify & Sign Up' }}</button>
      <p v-if="message" class="auth-message" role="alert">{{ message }}</p>
      <RouterLink v-if="mode === 'login'" class="auth-link" to="/forgot-password">Forgot Password?</RouterLink>
      <p class="auth-switch" v-if="mode === 'login'">Don’t have an account? <RouterLink to="/signup">Sign Up</RouterLink></p>
      <p class="auth-switch" v-else>Already have an account? <RouterLink to="/login">Log In</RouterLink></p>
    </form>
  </main>
</template>

<style scoped>
.auth-screen{min-height:100svh;display:grid;place-items:center;padding:28px;background:#fff}.auth-card{width:min(100%,640px);min-height:540px;padding:22px clamp(24px,5vw,62px) 36px;border:1px solid #111;border-radius:6px;background:#cbd1ce;display:flex;flex-direction:column;gap:18px}.auth-back{font:16px 'DM Mono',monospace;color:#174b32}.auth-card h1{font:36px 'DM Mono',monospace;text-decoration:underline;margin:0 0 12px}.auth-card label{display:grid;gap:9px;font-size:19px}.auth-card label input{height:60px;border:1px solid #111;border-radius:28px;padding:0 20px;background:#fff;font-size:20px;min-width:0}.sent-note{font-size:12px;margin-top:-12px}.code-heading{display:flex;justify-content:space-between;gap:8px;font-size:17px}.code-input{width:min(100%,250px);height:50px;border:0;border-bottom:1px solid #111;background:transparent;font-size:23px;letter-spacing:.4em;padding:0 8px}.auth-submit{align-self:center;width:min(100%,300px);height:64px;border:1px solid #111;border-radius:15px;background:#1b7048;color:white;font-weight:700;font-size:19px;cursor:pointer}.auth-link,.auth-switch{font-size:17px;margin:0 8px}.auth-link{color:#272186}.auth-switch a{color:#272186;text-decoration:underline}.auth-message{color:#8d251d;margin:0}@media(max-width:520px){.auth-screen{padding:14px}.auth-card{min-height:0;padding:22px;gap:16px}.auth-card h1{font-size:30px}.auth-card label{font-size:16px}.auth-card label input{height:54px;font-size:17px}.code-heading{font-size:14px}.auth-submit{height:56px}}
</style>
