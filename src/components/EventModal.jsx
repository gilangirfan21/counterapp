import { useEffect, useState } from 'react'
import { CATEGORIES } from '../lib/categories'
import { UNITS } from '../lib/dateUtils'
import DatePicker from './DatePicker'

const PRESET_COLORS = ['#ff6b35', '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6']

const EMPTY_FORM = {
  title: '',
  date: '',
  description: '',
  category: 'personal',
  color: PRESET_COLORS[0],
  unit: 'days',
  pinned: false,
}

export default function EventModal({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!open) return
    setError(null)
    setForm(
      initialData
        ? {
            title: initialData.title,
            date: initialData.date,
            description: initialData.description ?? '',
            category: initialData.category ?? 'personal',
            color: initialData.color ?? PRESET_COLORS[0],
            unit: initialData.unit ?? 'days',
            pinned: !!initialData.pinned,
          }
        : EMPTY_FORM,
    )
  }, [open, initialData])

  if (!open) return null

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (!form.date) {
      setError('Pilih tanggal dulu.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      await onSubmit(form)
      onClose()
    } catch (err) {
      setError(err.message ?? 'Gagal menyimpan.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-10 max-h-[90vh] w-full max-w-[420px] overflow-y-auto rounded-t-2xl bg-white p-6 pb-8 shadow-xl dark:bg-neutral-900">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />

        <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-white">
          {initialData ? 'Edit event' : 'Tambah event'}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Judul</span>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Tanggal</span>
            <DatePicker value={form.date} onChange={(date) => update('date', date)} />
          </div>

          <label className="block">
            <span className="text-sm text-neutral-600 dark:text-neutral-400">
              Deskripsi <span className="text-neutral-400">(opsional)</span>
            </span>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              className="mt-1.5 w-full resize-none rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
            />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Kategori</span>
              <div className="relative mt-1.5">
                <select
                  value={form.category}
                  onChange={(e) => update('category', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pl-4 pr-9 text-neutral-900 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </label>

            <label className="block">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">Satuan</span>
              <div className="relative mt-1.5">
                <select
                  value={form.unit}
                  onChange={(e) => update('unit', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2.5 pl-4 pr-9 text-neutral-900 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
                >
                  {UNITS.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </label>
          </div>

          <div>
            <span className="text-sm text-neutral-600 dark:text-neutral-400">Warna</span>
            <div className="mt-1.5 flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => update('color', c)}
                    aria-label={c}
                    style={{ backgroundColor: c }}
                    className={`h-7 w-7 rounded-full ${form.color === c ? 'ring-2 ring-offset-2 ring-neutral-900 dark:ring-offset-neutral-900 dark:ring-neutral-100' : ''}`}
                  />
                ))}
                <input
                  type="color"
                  value={form.color}
                  onChange={(e) => update('color', e.target.value)}
                  className="h-7 w-7 cursor-pointer rounded-full border-0 bg-transparent p-0"
                />
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={form.pinned}
                aria-label={form.pinned ? 'Lepas pin event ini' : 'Pin event ini'}
                onClick={() => update('pinned', !form.pinned)}
                className="flex shrink-0 items-center gap-1.5"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={form.pinned ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  strokeWidth="1.75"
                  className={form.pinned ? 'text-orange-500' : 'text-neutral-400'}
                >
                  <path d="M16 3a1 1 0 0 1 1 1v6.5l2.4 4.8A1 1 0 0 1 18.5 17H13v4a1 1 0 1 1-2 0v-4H5.5a1 1 0 0 1-.9-1.7L7 10.5V4a1 1 0 0 1 1-1h8Z" />
                </svg>
                <span
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    form.pinned ? 'bg-orange-500' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      form.pinned ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-orange-400 disabled:opacity-50"
            >
              {submitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
