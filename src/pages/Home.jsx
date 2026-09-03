import { useEffect, useMemo, useState } from 'react'
import { useEventStore } from '../store/useEventStore'
import Navbar from '../components/Navbar'
import CategoryBar from '../components/CategoryBar'
import EventCard from '../components/EventCard'
import EventModal from '../components/EventModal'

export default function Home() {
  const events = useEventStore((state) => state.events)
  const loading = useEventStore((state) => state.loading)
  const error = useEventStore((state) => state.error)
  const categoryFilter = useEventStore((state) => state.categoryFilter)
  const sortBy = useEventStore((state) => state.sortBy)
  const sortOrder = useEventStore((state) => state.sortOrder)
  const fetchEvents = useEventStore((state) => state.fetchEvents)
  const addEvent = useEventStore((state) => state.addEvent)
  const updateEvent = useEventStore((state) => state.updateEvent)
  const deleteEvent = useEventStore((state) => state.deleteEvent)
  const togglePin = useEventStore((state) => state.togglePin)
  const setCategoryFilter = useEventStore((state) => state.setCategoryFilter)
  const setSortBy = useEventStore((state) => state.setSortBy)
  const toggleSortOrder = useEventStore((state) => state.toggleSortOrder)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const visibleEvents = useMemo(() => {
    let list = events
    if (categoryFilter !== 'all') {
      list = list.filter((e) => e.category === categoryFilter)
    }
    list = [...list].sort((a, b) => {
      const diff =
        sortBy === 'title' ? a.title.localeCompare(b.title) : new Date(a.date) - new Date(b.date)
      return sortOrder === 'asc' ? diff : -diff
    })
    // Stable sort keeps the order above within each pinned group.
    return list.sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1))
  }, [events, categoryFilter, sortBy, sortOrder])

  function openAddModal() {
    setEditingEvent(null)
    setModalOpen(true)
  }

  function openEditModal(event) {
    setEditingEvent(event)
    setModalOpen(true)
  }

  async function handleSubmit(form) {
    if (editingEvent) {
      await updateEvent(editingEvent.id, form)
    } else {
      await addEvent(form)
    }
  }

  async function handleDelete(event) {
    if (!window.confirm(`Hapus "${event.title}"?`)) return
    await deleteEvent(event.id)
  }

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[420px] bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <Navbar />

      <div className="space-y-4 py-4 pb-24">
        <CategoryBar value={categoryFilter} onChange={setCategoryFilter} />

        <div className="flex items-center justify-between px-4">
          <span className="text-sm text-neutral-500">{visibleEvents.length} event</span>

          <div className="flex items-center gap-1">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-lg bg-transparent py-1 pl-2 pr-6 text-sm font-medium text-neutral-600 outline-none hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              >
                <option value="date">Tanggal</option>
                <option value="title">Judul</option>
              </select>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-neutral-400"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>

            <button
              type="button"
              onClick={toggleSortOrder}
              aria-label={sortOrder === 'asc' ? 'Urutan naik' : 'Urutan turun'}
              className="rounded-lg p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${sortOrder === 'desc' ? 'rotate-180' : ''}`}
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-3 px-4">
          {loading && <p className="py-12 text-center text-sm text-neutral-500">Memuat...</p>}

          {!loading && error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-900/10 dark:text-red-400">
              Gagal memuat event: {error}
            </p>
          )}

          {!loading && !error && visibleEvents.length === 0 && (
            <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-200 px-6 py-16 text-center dark:border-neutral-800">
              <p className="text-sm text-neutral-500">
                {categoryFilter === 'all' ? 'Belum ada event.' : 'Belum ada event di kategori ini.'}
              </p>
              <p className="text-xs text-neutral-400">Tap tombol + buat nambah event baru.</p>
            </div>
          )}

          {!loading &&
            !error &&
            visibleEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={() => openEditModal(event)}
                onDelete={() => handleDelete(event)}
                onTogglePin={() => togglePin(event.id)}
              />
            ))}
        </div>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-20 flex justify-center">
        <div className="flex w-full max-w-[420px] justify-end px-6">
          <button
            type="button"
            onClick={openAddModal}
            aria-label="Tambah event"
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg transition hover:bg-orange-400"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      <EventModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingEvent}
      />
    </div>
  )
}
