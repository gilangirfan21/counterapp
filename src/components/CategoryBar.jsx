import { CATEGORIES } from '../lib/categories'

const ALL = { value: 'all', label: 'Semua' }

export default function CategoryBar({ value, onChange }) {
  const options = [ALL, ...CATEGORIES]

  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {options.map((option) => {
        const active = option.value === value
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
              active
                ? 'border-orange-500 bg-orange-500 text-white'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 dark:border-neutral-800 dark:text-neutral-400 dark:hover:border-neutral-700'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
