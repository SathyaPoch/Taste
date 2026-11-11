import { fileURLToPath, URL } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

function mockAuth() {
  return {
    name: 'taste-mock-auth',
    configureServer(server: import('vite').ViteDevServer) {
      server.middlewares.use('/api/auth/signup', async (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ message: 'Method not allowed' }))
          return
        }
        try {
          let rawBody = ''
          for await (const chunk of req) rawBody += chunk
          const { phone, password, verificationCode } = JSON.parse(rawBody) as { phone?: string; password?: string; verificationCode?: string }
          if (!phone?.trim() || !password || password.length < 6 || verificationCode?.trim() !== '1111') {
            res.statusCode = 400
            res.end(JSON.stringify({ message: 'Enter a valid phone number, password, and demo verification code 1111.' }))
            return
          }
          const dbPath = resolve(server.config.root, '../../userdb.json')
          const db = JSON.parse(await readFile(dbPath, 'utf8')) as { users: Array<{ id: string; phone: string; password: string; verificationCode: string; name: string; role: string }> }
          const normalizePhone = (value: string) => value.replace(/\D/g, '')
          if (db.users.some((user) => normalizePhone(user.phone) === normalizePhone(phone))) {
            res.statusCode = 409
            res.end(JSON.stringify({ message: 'An account with this phone number already exists. Please log in.' }))
            return
          }
          const user = { id: `usr-${Date.now()}`, phone: phone.trim(), password, name: 'Customer', role: 'customer', verificationCode: '1111' }
          db.users.push(user)
          await writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, 'utf8')
          res.end(JSON.stringify({ id: user.id, phone: user.phone, name: user.name, role: user.role }))
        } catch {
          res.statusCode = 400
          res.end(JSON.stringify({ message: 'Unable to create the account.' }))
        }
      })
      server.middlewares.use('/api/auth/login', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end(JSON.stringify({ message: 'Method not allowed' }))
          return
        }

        try {
          let rawBody = ''
          for await (const chunk of req) rawBody += chunk
          const { phone, password, verificationCode } = JSON.parse(rawBody) as {
            phone?: string
            password?: string
            verificationCode?: string
          }
          const dbPath = resolve(server.config.root, '../../userdb.json')
          const db = JSON.parse(await readFile(dbPath, 'utf8')) as {
            users: Array<{
              id: string
              phone: string
              password: string
              verificationCode: string
              name: string
              role: string
            }>
          }
          const normalizePhone = (value: string) => value.replace(/\D/g, '')
          const user = db.users.find((candidate) => normalizePhone(candidate.phone) === normalizePhone(phone ?? '')
            && candidate.password === password
            && candidate.verificationCode === verificationCode?.trim())

          res.setHeader('Content-Type', 'application/json')
          if (!user) {
            res.statusCode = 401
            res.end(JSON.stringify({ message: 'Phone number, password, or verification code is incorrect.' }))
            return
          }

          res.end(JSON.stringify({ id: user.id, phone: user.phone, name: user.name, role: user.role }))
        } catch {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ message: 'Unable to read mock user data.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mockAuth(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
