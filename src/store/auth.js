import { defineStore } from 'pinia'
import { supabase } from '../service/supabase'
import { ref } from 'vue'

import router from '../routes'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)


  async function login(email, password) {
    try {
      loading.value = true
      error.value = null

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (authError) throw authError

      user.value = data.user
      router.push('/')
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function checkUser() {
    const { data } = await supabase.auth.getSession()
    console.log('data', data)
    user.value = data.session?.user ?? null
    return user.value
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('Error logging out:', error.message)
      return
    }
    router.push('/login')
  }

  return {
    login,
    checkUser,
    logout
  }
})