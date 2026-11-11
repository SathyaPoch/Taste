<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { normalizeCambodianPhone, signUpWithPhone } from '@/services/authService'
const router = useRouter()
const phone = ref('')
const code = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
async function signUp() {
  if (!/^\d{4}$/.test(code.value)) { error.value = 'Enter the 4 digit verification code. Demo code: 1111.'; return }
  if (password.value.length < 6) { error.value = 'Choose a password with at least 6 characters.'; return }
  error.value = ''
  loading.value = true
  try {
    const user = await signUpWithPhone(normalizeCambodianPhone(phone.value), password.value, code.value)
    localStorage.setItem('taste-user', JSON.stringify(user))
    await router.push('/browse')
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : 'Unable to create the account.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="auth-screen"><form class="auth-card" @submit.prevent="signUp">
    <RouterLink class="back" to="/">← Taste</RouterLink><h1>Sign Up</h1>
    <label>Enter Your Phone Number<div class="phone-input"><span>+855</span><input v-model="phone" type="tel" inputmode="numeric" autocomplete="tel-national" required placeholder="12 345 678" /></div></label>
    <small>✉ Code sent to your phone · Demo code: 1111</small>
    <div class="code-heading"><span>Your Verification Code</span><span>Expires in 04:59</span></div>
    <input v-model="code" class="code" inputmode="numeric" maxlength="4" placeholder="— — — —" aria-label="4 digit verification code" />
    <label>Password<input v-model="password" type="password" autocomplete="new-password" required minlength="6" /></label>
    <button class="submit" type="submit" :disabled="loading">{{ loading ? 'Creating account…' : 'Verify & Sign Up' }}</button>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <p class="terms">By continuing, you agree to our <a href="#terms">Terms of Sale, Terms of Service, and Privacy Policy.</a></p>
    <p class="switch">Already have an account? <RouterLink to="/login">Log In</RouterLink></p>
  </form></main>
</template>

<style scoped>
.auth-screen{min-height:100svh;display:grid;place-items:center;padding:24px;background:#fff}.auth-card{width:min(100%,640px);padding:26px clamp(24px,4vw,56px) 38px;border:1px solid #111;border-radius:6px;background:#cbd1ce;display:flex;flex-direction:column;gap:14px}.back{font:16px 'DM Mono',monospace;color:#174b32}.auth-card h1{font:36px 'DM Mono',monospace;text-decoration:underline;margin:0 0 10px}.auth-card label{display:grid;gap:8px;font-size:19px}.auth-card label input{height:60px;border:1px solid #111;border-radius:30px;padding:0 20px;background:#fff;font-size:20px}.auth-card small{font-size:12px;margin-top:-8px}.code-heading{display:flex;justify-content:space-between;gap:8px;font-size:17px}.code{width:min(100%,250px);height:50px;border:0;border-bottom:1px solid #111;background:transparent;font-size:23px;letter-spacing:.3em}.submit{height:64px;border:1px solid #111;border-radius:15px;background:#1b7048;color:#fff;font-size:19px;font-weight:700;cursor:pointer}.terms{font-size:12px;font-style:italic;text-align:center}.terms a,.switch a{color:#272186;text-decoration:underline}.switch{font-size:16px;margin:0}.error{color:#8d251d;margin:0}@media(max-width:520px){.auth-card{padding:22px;gap:14px}.auth-card h1{font-size:30px}.auth-card label{font-size:16px}.auth-card label input{height:54px;font-size:17px}.code-heading{font-size:14px}}
.phone-input{height:60px;border:1px solid #111;border-radius:30px;background:#fff;display:flex;align-items:center;overflow:hidden}.auth-card .phone-input span{padding:0 18px;border-right:1px solid #111;font-size:20px;white-space:nowrap}.auth-card .phone-input input{flex:1;min-width:0;height:100%;border:0;border-radius:0;padding:0 18px;background:transparent}@media(max-width:520px){.phone-input{height:54px}.auth-card .phone-input span{font-size:17px}}
</style>
