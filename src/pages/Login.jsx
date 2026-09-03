import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

export default function Login() {
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const signIn = useAuthStore((state) => state.signIn)
  const error = useAuthStore((state) => state.error)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) navigate('/', { replace: true })
  }, [user, navigate])

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate('/', { replace: true })
    } catch {
      // error surfaced via auth.error
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col justify-center px-6 py-10 bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">CounterDate</h1>
        <p className="mt-1 text-sm text-neutral-500">Masuk untuk lanjut hitung momen pentingmu.</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Email</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </label>

        <label className="block">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">Kata sandi</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-neutral-900 outline-none transition focus:border-orange-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </label>

        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-orange-400 disabled:opacity-50"
        >
          {submitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-500">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-orange-500 hover:underline">
          Daftar
        </Link>
      </p>
    </div>
  )
}
