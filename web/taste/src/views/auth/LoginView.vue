<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { loginWithPhone, normalizeCambodianPhone } from '@/services/authService'

const router = useRouter()
const phone = ref('')
const password = ref('')
const verificationCode = ref('')
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  try {
    const user = await loginWithPhone(normalizeCambodianPhone(phone.value), password.value, verificationCode.value)
    localStorage.setItem('taste-user', JSON.stringify(user))
    await router.push(user.role === 'customer' || user.role === 'farmer' ? '/browse' : user.role === 'admin' ? '/admin' : '/')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to sign in.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-screen">
    <form class="auth-card" @submit.prevent="login">
      <h1>LOG IN</h1>
      <label>Enter Your Phone Number :<div class="phone-input"><span>+855</span><input v-model="phone" type="tel" inputmode="numeric" autocomplete="tel-national" required placeholder="12 345 678" /></div></label>
      <label>Password :<input v-model="password" type="password" autocomplete="current-password" required /></label>
      <label>4-Digit Verification Code :<input v-model="verificationCode" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{4}" maxlength="4" required /></label>
      <button class="submit" type="submit" :disabled="loading">{{ loading ? 'Sign In' : 'Sign In' }}</button>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <RouterLink class="forgot" to="/forgot-password">Forgot Password?</RouterLink>
      <p class="switch">Don't have an account? <RouterLink to="/signup">Sign Up</RouterLink></p>
    </form>
  </main>
</template>

<style scoped>
.auth-screen{min-height:100svh;display:grid;place-items:center;padding:24px;background:#fff}.auth-card{width:min(100%,642px);min-height:646px;padding:12px clamp(24px,4.2vw,61px) 36px;border:1px solid #111;border-radius:6px;background:#cbd1ce;display:flex;flex-direction:column;gap:17px}.auth-card h1{font:36px 'DM Mono',monospace;text-decoration:underline;margin:0 0 22px}.auth-card label{display:grid;gap:9px;font-size:24px}.auth-card input{height:60px;border:1px solid #111;border-radius:30px;padding:0 20px;background:#fff;font-size:20px}.submit{align-self:center;width:186px;height:64px;border:1px solid #111;border-radius:15px;background:#1b7048;color:#fff;font-size:19px;font-weight:700;cursor:pointer}.forgot{color:#272186;margin:22px 28px 0;font-size:22px}.switch{font-size:22px;margin:0 28px}.switch a{color:#272186;text-decoration:underline}.error{color:#8d251d;margin:0}@media(max-width:520px){.auth-card{min-height:0;padding:22px;gap:16px}.auth-card h1{font-size:30px;margin-bottom:6px}.auth-card label{font-size:18px}.auth-card input{height:54px;font-size:17px}.forgot,.switch{font-size:17px;margin-left:8px}}
.phone-input{height:60px;border:1px solid #111;border-radius:30px;background:#fff;display:flex;align-items:center;overflow:hidden}.auth-card .phone-input span{padding:0 18px;border-right:1px solid #111;font-size:20px;white-space:nowrap}.auth-card .phone-input input{flex:1;min-width:0;height:100%;border:0;border-radius:0;padding:0 18px;background:transparent}@media(max-width:520px){.phone-input{height:54px}.auth-card .phone-input span{font-size:17px}}
</style>
