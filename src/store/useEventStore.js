import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useEventStore = create((set, get) => ({
  events: [],
  loading: false,
  error: null,
  categoryFilter: 'all',
  sortBy: 'date',
  sortOrder: 'asc',

  async fetchEvents() {
    set({ loading: true, error: null })
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: true })

    if (error) {
      set({ error: error.message, loading: false })
      return
    }
    set({ events: data ?? [], loading: false })
  },

  async addEvent(payload) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { data, error } = await supabase
      .from('events')
      .insert({ ...payload, user_id: user.id })
      .select()
      .single()

    if (error) throw error
    set((state) => ({ events: [...state.events, data] }))
    return data
  },

  async updateEvent(id, payload) {
    const { data, error } = await supabase.from('events').update(payload).eq('id', id).select().single()

    if (error) throw error
    set((state) => ({ events: state.events.map((e) => (e.id === id ? data : e)) }))
    return data
  },

  async deleteEvent(id) {
    const { error } = await supabase.from('events').delete().eq('id', id)
    if (error) throw error
    set((state) => ({ events: state.events.filter((e) => e.id !== id) }))
  },

  async togglePin(id) {
    const event = get().events.find((e) => e.id === id)
    if (!event) return
    return get().updateEvent(id, { pinned: !event.pinned })
  },

  setCategoryFilter(category) {
    set({ categoryFilter: category })
  },

  setSortBy(field) {
    set({ sortBy: field })
  },

  toggleSortOrder() {
    set((state) => ({ sortOrder: state.sortOrder === 'asc' ? 'desc' : 'asc' }))
  },
}))
