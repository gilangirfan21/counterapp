import { formatDate, getEventCount } from '../lib/dateUtils'
import { categoryFor } from '../lib/categories'

const STATUS_LABEL = {
  passed: 'Passed',
  today: 'Today',
  upcoming: 'Upcoming',
}

export default function EventCard({ event, onEdit, onDelete, onTogglePin }) {
  const category = categoryFor(event.category)
  const { parts, status } = getEventCount(event.date, event.unit)

  return (
    <article
      style={{ borderLeftColor: event.color }}
      className="flex items-start justify-between gap-3 rounded-xl border border-l-4 border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {event.pinned && (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="shrink-0 text-neutral-400">
              <path d="M16 3a1 1 0 0 1 1 1v6.5l2.4 4.8A1 1 0 0 1 18.5 17H13v4a1 1 0 1 1-2 0v-4H5.5a1 1 0 0 1-.9-1.7L7 10.5V4a1 1 0 0 1 1-1h8Z" />
            </svg>
          )}
          <h3 className="truncate font-medium text-neutral-900 dark:text-white">{event.title}</h3>
        </div>

        <div className="mt-1.5 flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${category.badge}`}>{category.label}</span>
          <span className="text-xs text-neutral-500">{formatDate(event.date)}</span>
        </div>

        {event.description && (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{event.description}</p>
        )}

        <div className="mt-3 flex items-center gap-3">
          <button
            type="button"
            onClick={onTogglePin}
            aria-label={event.pinned ? 'Lepas pin' : 'Pin event'}
            className="text-neutral-400 transition hover:text-orange-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill={event.pinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.75">
              <path d="M16 3a1 1 0 0 1 1 1v6.5l2.4 4.8A1 1 0 0 1 18.5 17H13v4a1 1 0 1 1-2 0v-4H5.5a1 1 0 0 1-.9-1.7L7 10.5V4a1 1 0 0 1 1-1h8Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit"
            className="text-neutral-400 transition hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onDelete}
            aria-label="Hapus"
            className="text-neutral-400 transition hover:text-red-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-end text-right">
        {parts.length === 1 ? (
          <>
            <span style={{ color: event.color }} className="text-3xl font-bold leading-none tabular-nums">
              {parts[0].value}
            </span>
            <span className="mt-1 text-xs text-neutral-500">{parts[0].label}</span>
          </>
        ) : (
          <div className="flex items-end gap-3">
            {parts.map((part) => (
              <div key={part.level} className="flex flex-col items-center">
                <span style={{ color: event.color }} className="text-3xl font-bold leading-none tabular-nums">
                  {part.value}
                </span>
                <span className="mt-1 text-xs text-neutral-500">{part.short}</span>
              </div>
            ))}
          </div>
        )}
        <span
          className={`mt-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${
            status === 'passed'
              ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
              : status === 'today'
                ? 'bg-orange-500/10 text-orange-500'
                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
          }`}
        >
          {STATUS_LABEL[status]}
        </span>
      </div>
    </article>
  )
}
