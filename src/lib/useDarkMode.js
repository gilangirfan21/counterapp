import { useEffect, useState } from 'react'

function getInitial() {
  const stored = localStorage.getItem('theme')
  return stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function useDarkMode() {
  const [isDark, setIsDark] = useState(getInitial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  function toggle() {
    setIsDark((d) => !d)
  }

  return { isDark, toggle }
}
