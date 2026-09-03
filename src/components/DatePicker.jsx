import { useEffect, useRef, useState } from 'react'
import dayjs from 'dayjs'

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const MONTH_NAMES = Array.from({ length: 12 }, (_, i) => dayjs().month(i).format('MMMM'))
const CURRENT_YEAR = dayjs().year()
const YEARS = Array.from({ length: 121 }, (_, i) => CURRENT_YEAR + 20 - i)

function buildMonthGrid(monthDate) {
  const start = monthDate.startOf('month')
  const daysInMonth = monthDate.daysInMonth()
  const startWeekday = start.day()

  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(start.date(d))
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}

export default function DatePicker({ value, onChange, placeholder = 'Pilih tanggal' }) {
  const [open, setOpen] = useState(false)
  const [viewMonth, setViewMonth] = useState(() => (value ? dayjs(value) : dayjs()).startOf('month'))
  const wrapperRef = useRef(null)

  useEffect(() => {
    if (!open) return
    setViewMonth((value ? dayjs(value) : dayjs()).startOf('month'))

    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const selected = value ? dayjs(value) : null
  const today = dayjs().startOf('day')
  const cells = buildMonthGrid(viewMonth)

  function selectDay(day) {
    onChange(day.format('YYYY-MM-DD'))
    setOpen(false)
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-1.5 flex w-full items-center justify-between rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-left text-neutral-900 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
      >
        <span className={selected ? '' : 'text-neutral-400'}>
          {selected ? selected.format('D MMMM YYYY') : placeholder}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 text-neutral-400"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 mt-2 w-full min-w-[280px] rounded-xl border border-neutral-200 bg-white p-3 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-2 flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => setViewMonth((m) => m.subtract(1, 'month'))}
              aria-label="Bulan sebelumnya"
              className="shrink-0 rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <div className="flex items-center gap-1">
              <div className="relative">
                <select
                  value={viewMonth.month()}
                  onChange={(e) => setViewMonth((m) => m.month(Number(e.target.value)))}
                  className="appearance-none rounded-lg bg-transparent py-1 pl-1.5 pr-5 text-sm font-medium capitalize outline-none hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {MONTH_NAMES.map((name, i) => (
                    <option key={name} value={i} className="capitalize">
                      {name}
                    </option>
                  ))}
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
              <div className="relative">
                <select
                  value={viewMonth.year()}
                  onChange={(e) => setViewMonth((m) => m.year(Number(e.target.value)))}
                  className="appearance-none rounded-lg bg-transparent py-1 pl-1.5 pr-5 text-sm font-medium outline-none hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
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
            </div>

            <button
              type="button"
              onClick={() => setViewMonth((m) => m.add(1, 'month'))}
              aria-label="Bulan berikutnya"
              className="shrink-0 rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-neutral-400">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (!day) return <span key={i} />
              const isSelected = selected && day.isSame(selected, 'day')
              const isToday = day.isSame(today, 'day')
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                    isSelected
                      ? 'bg-orange-500 text-white'
                      : isToday
                        ? 'font-semibold text-orange-500'
                        : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                  }`}
                >
                  {day.date()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
