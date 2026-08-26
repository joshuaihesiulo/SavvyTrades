import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useAccounts, useAccountStats, useEquityCurve } from '../hooks/useData'
import { fmtPL } from '../utils'
import AtmCard from '../components/ui/AtmCard'
import GlassCard from '../components/ui/GlassCard'
import StatCard from '../components/ui/StatCard'
import AccountsWallet from '../components/ui/AccountsWallet'
import { IconChevronDown } from '../components/Icons'

function EquityChart({ points }) {
  if (!points || points.length < 2) {
    return (
      <svg width="90" height="34" viewBox="0 0 90 34" fill="none" aria-hidden>
        <defs>
          <linearGradient id="pl-grad" x1="0" y1="0" x2="90" y2="0">
            <stop stopColor="#3fd9ac" />
            <stop offset="1" stopColor="#7c93ff" />
          </linearGradient>
        </defs>
        <path
          d="M0 28 L12 24 L24 26 L36 16 L48 19 L60 8 L72 12 L90 2"
          stroke="url(#pl-grad)"
          strokeWidth="2.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  const balances = points.map((p) => p.balance)
  const min = Math.min(...balances)
  const max = Math.max(...balances)
  const range = max - min || 1
  const width = 90
  const height = 34
  const padding = 2

  const pathData = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * (width - padding * 2) + padding
      const y = height - padding - ((p.balance - min) / range) * (height - padding * 2)
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`
    })
    .join(' ')

  const isPositive = (points[points.length - 1].balance - points[0].balance) >= 0

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" aria-hidden>
      <defs>
        <linearGradient id="pl-grad" x1="0" y1="0" x2={width} y2="0">
          <stop stopColor={isPositive ? '#3fd9ac' : '#f2778c'} />
          <stop offset="1" stopColor="#7c93ff" />
        </linearGradient>
      </defs>
      <path
        d={pathData}
        stroke="url(#pl-grad)"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const { accounts, loading: accountsLoading } = useAccounts()
  const [walletOpen, setWalletOpen] = useState(false)
  const [activeId, setActiveId] = useState(null)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(0)

  const resolvedId = activeId || accounts[0]?.id
  const { stats, loading: statsLoading } = useAccountStats(resolvedId)
  const { data: equityData } = useEquityCurve(resolvedId)
  const active = accounts.find((a) => a.id === resolvedId)

  const openWallet = () => setWalletOpen(true)

  const firstName = user?.name?.split(' ')[0] || 'Trader'
  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'

  return (
    <div>
      <div className="animate-fade-up mt-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-ink-3">Good evening</div>
          <div className="font-display text-lg font-bold">{firstName}</div>
        </div>
        <Link
          to="/settings"
          aria-label="Profile & settings"
          className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-blue1 to-blue2 font-display text-sm font-bold text-[#0b0d13] transition-transform active:scale-95"
        >
          {initials}
        </Link>
      </div>

      {accountsLoading ? (
        <div className="mt-5 flex justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-blue1" />
        </div>
      ) : accounts.length === 0 ? (
        <div className="animate-fade-up mt-10 rounded-3xl border border-border bg-gradient-to-b from-white/[0.07] to-white/[0.045] p-8 text-center">
          <p className="text-sm text-ink-3">No accounts yet.</p>
          <Link
            to="/new-account"
            className="mt-4 inline-block rounded-2xl bg-gradient-to-br from-blue1 to-blue2 px-6 py-3 text-sm font-bold text-[#0b0d13]"
          >
            Create your first account
          </Link>
        </div>
      ) : (
        <>
          <div
            role="button"
            tabIndex={0}
            onClick={openWallet}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') openWallet()
            }}
            onPointerDown={(e) => {
              dragStart.current = e.clientY
              setDragging(true)
            }}
            onPointerUp={(e) => {
              const dy = e.clientY - dragStart.current
              setDragging(false)
              if (dy > 50 || Math.abs(dy) < 12) openWallet()
            }}
            onPointerCancel={() => setDragging(false)}
            onPointerLeave={() => setDragging(false)}
            className={`animate-fade-up relative mt-5 cursor-pointer touch-pan-x select-none transition-transform duration-200 ${
              dragging ? 'scale-[0.985]' : ''
            }`}
            style={{ animationDelay: '0.04s' }}
          >
            <div
              className="absolute inset-x-3 -bottom-2.5 z-0 h-full rounded-[32px] border border-border bg-surface-2"
              aria-hidden
            />
            <div
              className="absolute inset-x-6 -bottom-5 z-0 h-full rounded-[32px] border border-border bg-surface"
              aria-hidden
            />
            <div className="relative z-[1]">
              <AtmCard
                name={active?.name || ''}
                balance={active?.currentBalance ?? 0}
                pl={active?.percentChange ?? 0}
              />
            </div>
          </div>

          <div
            className="animate-fade-up mt-3 flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-3"
            style={{ animationDelay: '0.06s' }}
          >
            Pull down or tap the card to open your wallet
            <IconChevronDown className="text-ink-2" />
          </div>

          <div
            className="animate-fade-up mt-6 flex items-baseline justify-between"
            style={{ animationDelay: '0.09s' }}
          >
            <div className="font-display text-base font-semibold">Performance</div>
            <div className="text-xs text-ink-3">All time</div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <StatCard
              className="animate-fade-up"
              label="Total Trades"
              value={statsLoading ? '—' : String(stats?.totalTrades ?? 0)}
            />
            <StatCard
              className="animate-fade-up"
              label="Win Rate"
              value={statsLoading ? '—' : `${stats?.winRate ?? 0}%`}
              valueClass="text-mint"
            />
            <GlassCard
              className="animate-fade-up col-span-2 flex items-center justify-between p-4"
              style={{ animationDelay: '0.09s' }}
            >
              <div>
                <div className="text-[11.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
                  Total P&L
                </div>
                <div className={`mt-1.5 font-display text-[21px] font-semibold tabular-nums ${(stats?.totalPnL ?? 0) >= 0 ? 'text-mint' : 'text-rose'}`}>
                  {statsLoading ? '—' : fmtPL(stats?.totalPnL ?? 0)}
                </div>
              </div>
              <EquityChart points={equityData?.points || []} />
            </GlassCard>
            <StatCard
              className="animate-fade-up"
              label="Wins"
              value={statsLoading ? '—' : String(stats?.wins ?? 0)}
              valueClass="text-mint"
            />
            <StatCard
              className="animate-fade-up"
              label="Losses"
              value={statsLoading ? '—' : String(stats?.losses ?? 0)}
              valueClass="text-rose"
            />
            <StatCard
              className="animate-fade-up"
              label="Break-even"
              value={statsLoading ? '—' : String(stats?.breakEven ?? 0)}
            />
            <StatCard
              className="animate-fade-up"
              label="Profit Factor"
              value={statsLoading ? '—' : String(stats?.profitFactor ?? 0)}
            />
            <StatCard
              className="animate-fade-up"
              label="Avg Win"
              value={statsLoading ? '—' : fmtPL(stats?.avgWin ?? 0)}
              valueClass="text-mint"
            />
            <StatCard
              className="animate-fade-up"
              label="Avg Loss"
              value={statsLoading ? '—' : fmtPL(stats?.avgLoss ?? 0)}
              valueClass="text-rose"
            />
            <StatCard
              className="animate-fade-up col-span-2"
              label="Average P&L per Trade"
              value={statsLoading ? '—' : fmtPL(stats?.avgPnL ?? 0)}
              valueClass={(stats?.avgPnL ?? 0) >= 0 ? 'text-mint' : 'text-rose'}
            />
          </div>

          <AccountsWallet
            open={walletOpen}
            onClose={() => setWalletOpen(false)}
            activeId={resolvedId}
            onSetActive={setActiveId}
            accounts={accounts}
          />
        </>
      )}
    </div>
  )
}
