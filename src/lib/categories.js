export const CATEGORIES = [
  {
    value: 'personal',
    label: 'Personal',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  },
  {
    value: 'family',
    label: 'Family',
    badge: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  },
  {
    value: 'others',
    label: 'Others',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
]

export function categoryFor(value) {
  return CATEGORIES.find((c) => c.value === value) ?? CATEGORIES[0]
}
