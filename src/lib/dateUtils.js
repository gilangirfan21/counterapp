import dayjs from 'dayjs'

const LEVEL_META = {
  year: { label: 'Tahun', short: 'Thn', code: 'y' },
  month: { label: 'Bulan', short: 'Bln', code: 'm' },
  week: { label: 'Minggu', short: 'Mgg', code: 'w' },
  day: { label: 'Hari', short: 'Hr', code: 'd' },
}

export const UNITS = [
  { value: 'days', label: 'Hari', levels: ['day'] },
  { value: 'weeks', label: 'Minggu', levels: ['week'] },
  { value: 'months', label: 'Bulan', levels: ['month'] },
  { value: 'years', label: 'Tahun', levels: ['year'] },
  { value: 'years_months_days', label: 'Tahun / Bulan / Hari', levels: ['year', 'month', 'day'] },
  { value: 'years_months', label: 'Tahun / Bulan', levels: ['year', 'month'] },
  { value: 'months_days', label: 'Bulan / Hari', levels: ['month', 'day'] },
]

export function formatDate(dateStr) {
  return dayjs(dateStr).format('D MMMM YYYY')
}

/**
 * Cascading breakdown across ordered calendar levels (e.g. year -> month -> day),
 * each remainder feeding the next — the same method an age calculator uses, so
 * "2 years 3 months 10 days" adds up instead of double-counting like independent
 * dayjs.diff() calls per unit would.
 */
function cascadeBreakdown(from, to, levels) {
  let cursor = from
  return levels.map((level) => {
    const value = to.diff(cursor, level)
    cursor = cursor.add(value, level)
    return value
  })
}

/**
 * Count between today and the event date, in the event's own unit (which may be
 * a single level like "days" or a compound one like "years_months_days").
 * Returns { parts, status } where status is 'passed' | 'today' | 'upcoming'.
 */
export function getEventCount(dateStr, unit = 'days') {
  const today = dayjs().startOf('day')
  const target = dayjs(dateStr).startOf('day')
  const config = UNITS.find((u) => u.value === unit) ?? UNITS[0]

  const isSame = target.isSame(today, 'day')
  const status = isSame ? 'today' : target.isBefore(today) ? 'passed' : 'upcoming'

  const [from, to] = isSame ? [today, today] : status === 'passed' ? [target, today] : [today, target]
  const values = cascadeBreakdown(from, to, config.levels)

  const parts = config.levels.map((level, i) => ({
    level,
    value: values[i],
    label: LEVEL_META[level].label,
    short: LEVEL_META[level].short,
    code: LEVEL_META[level].code,
  }))

  return { parts, status }
}
