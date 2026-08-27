import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { IconPlus, IconX } from '../Icons'
import Button from './Button'
import StackedAtmCard from './StackedAtmCard'

const slots = [
  {
    cls: 'top-0 z-30',
    drop: '[transform:translateX(-50%)]',
  },
  {
    cls: 'top-[70px] z-20 brightness-[0.72]',
    drop: '[transform:translateX(-50%)_translateY(70px)_scale(0.92)]',
  },
  {
    cls: 'top-[140px] z-10 brightness-[0.5]',
    drop: '[transform:translateX(-50%)_translateY(140px)_scale(0.85)]',
  },
]

const shadows = [
  'shadow-card',
  'shadow-[0_16px_30px_-16px_rgba(0,0,0,0.65)]',
  'shadow-[0_12px_22px_-14px_rgba(0,0,0,0.6)]',
]

const dropDelays = ['0s', '0.08s', '0.16s']

export default function AccountsWallet({ open, onClose, activeId, accounts = [] }) {
  const [selectedId, setSelectedId] = useState(activeId)
  const [dropped, setDropped] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!open) {
      setSelectedId(activeId)
      setDropped(false)
      return
    }
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setDropped(true), 150)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [open, activeId])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const selIdx = accounts.findIndex((a) => a.id === selectedId)
  const pos = (i) => (i - selIdx + accounts.length) % accounts.length

  return (
    <div
      className="animate-fade-in fixed inset-0 z-30 overflow-hidden bg-page/60 backdrop-blur-xl lg:left-auto lg:right-0 lg:w-[28rem]"
      onClick={onClose}
    >
      <div
        className="mx-auto flex h-full w-full max-w-md flex-col px-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full items-center justify-between pt-6">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close wallet"
            className="animate-fade-up flex h-11 w-11 items-center justify-center rounded-2xl border border-border-strong bg-white/[0.07] text-ink"
          >
            <IconX />
          </button>
          <span
            className="animate-fade-up text-xs font-semibold uppercase tracking-[0.14em] text-ink-3"
            style={{ animationDelay: '0.25s' }}
          >
            SavvyTrade · Wallet
          </span>
          <Link
            to="/new-account"
            aria-label="Open new account page"
            className="animate-fade-up flex h-11 w-11 items-center justify-center rounded-2xl border border-border-strong bg-white/[0.07] text-ink"
            style={{ animationDelay: '0.35s' }}
          >
            <IconPlus strokeWidth={2.2} />
          </Link>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="animate-fade-up mt-6 text-center">
            <h2 className="font-display text-[20px] font-semibold">Your Accounts</h2>
            <p className="mt-1 text-[12.5px] text-ink-3">Pick a card to make it active</p>
          </div>

          <div
            className="animate-fade-up relative mx-auto mt-6 h-[330px] w-[305px] max-w-full"
            style={{ animationDelay: '0.08s' }}
          >
            {accounts.map((acc, i) => {
              const s = pos(i)
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setSelectedId(acc.id)}
                  className={`absolute left-1/2 w-full origin-top transition-all duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    dropped
                      ? `${slots[s].cls} ${slots[s].drop}`
                      : 'top-0 z-30 [transform:translateX(-50%)_rotateX(28deg)]'
                  }`}
                  style={{ transitionDelay: dropped ? dropDelays[s] : '0s' }}
                >
                  <StackedAtmCard
                    account={acc}
                    active={activeId === acc.id}
                    shadowClass={shadows[s]}
                  />
                </button>
              )
            })}
          </div>
        </div>

        <div className="shrink-0 pb-[104px] pt-6">
          <Button
            variant="ghost"
            className="mx-auto w-[305px] max-w-full"
            onClick={() => navigate('/accounts')}
          >
            Set as Active Account
          </Button>
        </div>
      </div>
    </div>
  )
}
