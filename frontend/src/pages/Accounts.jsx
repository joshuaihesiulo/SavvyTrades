import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconPlus } from '../components/Icons'
import Button from '../components/ui/Button'
import StackedAtmCard from '../components/ui/StackedAtmCard'
import { useAccounts } from '../hooks/useData'

const stackPos = [
  'top-0 z-30 -translate-x-1/2',
  'top-[70px] z-20 -translate-x-1/2 scale-[0.92] brightness-[0.72]',
  'top-[140px] z-10 -translate-x-1/2 scale-[0.85] brightness-[0.5]',
]

const shadows = [
  'shadow-card',
  'shadow-[0_16px_30px_-16px_rgba(0,0,0,0.65)]',
  'shadow-[0_12px_22px_-14px_rgba(0,0,0,0.6)]',
]

export default function Accounts() {
  const { accounts, loading } = useAccounts()
  const [selectedId, setSelectedId] = useState(null)
  const navigate = useNavigate()

  const resolvedSelected = selectedId || accounts[0]?.id

  const selIdx = accounts.findIndex((a) => a.id === resolvedSelected)
  const pos = (i) => (i - selIdx + accounts.length) % accounts.length

  if (loading) {
    return (
      <div className="flex flex-col items-center pt-16">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-blue1" />
      </div>
    )
  }

  if (accounts.length === 0) {
    return (
      <div className="relative flex flex-col items-center pt-16">
        <Link
          to="/new-account"
          className="absolute right-0 top-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-border-strong bg-white/[0.07]"
          aria-label="Add account"
        >
          <IconPlus className="text-ink" strokeWidth={2.2} />
        </Link>
        <div className="text-center">
          <h1 className="font-display text-[20px] font-semibold">Your Accounts</h1>
          <p className="mt-1 text-[12.5px] text-ink-3">No accounts yet. Create one to get started.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col items-center pt-16 pb-32">
      <Link
        to="/new-account"
        className="absolute right-0 top-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-border-strong bg-white/[0.07]"
        aria-label="Add account"
      >
        <IconPlus className="text-ink" strokeWidth={2.2} />
      </Link>

      <div className="animate-fade-up text-center">
        <h1 className="font-display text-[20px] font-semibold">Your Accounts</h1>
        <p className="mt-1 text-[12.5px] text-ink-3">Tap a card to make it active</p>
      </div>

      <div className="animate-fade-up relative mt-8 h-[330px] w-full max-w-[305px]" style={{ animationDelay: '0.09s' }}>
        {accounts.map((acc, i) => (
          <button
            key={acc.id}
            type="button"
            onClick={() => setSelectedId(acc.id)}
            className={`absolute left-1/2 w-full transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${stackPos[pos(i)]}`}
          >
            <StackedAtmCard
              account={acc}
              active={resolvedSelected === acc.id}
              shadowClass={shadows[pos(i)]}
            />
          </button>
        ))}
      </div>

      <div className="animate-fade-up fixed inset-x-0 bottom-6 z-10 px-5 lg:left-auto lg:right-0 lg:w-[28rem]">
        <Button
          variant="ghost"
          className="mx-auto w-[305px] max-w-full"
          onClick={() => navigate(`/dashboard?account=${resolvedSelected}`)}
        >
          Set as Active Account
        </Button>
      </div>
    </div>
  )
}
