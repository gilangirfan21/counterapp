import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set) => ({
  user: null,
  loading: true,
  error: null,
  initialized: false,

  async init() {
    const { data } = await supabase.auth.getSession()
    set({ user: data.session?.user ?? null, loading: false, initialized: true })

    supabase.auth.onAuthStateChange((_event, session) => {
      set({ user: session?.user ?? null })
    })
  },

  async signIn(email, password) {
    set({ error: null })
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      set({ error: error.message })
      throw error
    }
    set({ user: data.user })
    return data
  },

  async signUp(email, password) {
    set({ error: null })
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      set({ error: error.message })
      throw error
    }
    set({ user: data.user })
    return data
  },

  async signOut() {
    await supabase.auth.signOut()
    set({ user: null })
  },
}))
