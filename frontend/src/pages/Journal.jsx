import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAccounts, useTrades } from '../hooks/useData'
import { fmtDate, fmtTime, badgeFromSymbol, normalizeDirection, normalizeOutcome } from '../utils'
import { IconPlus, IconSearch, IconFilter } from '../components/Icons'
import TradeCard from '../components/ui/TradeCard'
import EmptyState from '../components/ui/EmptyState'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Open' },
  { key: 'closed', label: 'Closed' },
]

export default function Journal() {
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('all')
  const { accounts, loading: accountsLoading } = useAccounts()
  const { trades, loading } = useTrades(accounts[0]?.id)

  const displayTrades = trades.map((t) => ({
    ...t,
    badge: badgeFromSymbol(t.symbol),
    date: fmtDate(t.openedAt),
    time: fmtTime(t.openedAt),
    direction: normalizeDirection(t.direction),
    outcome: normalizeOutcome(t.outcome),
    pl: t.pnl,
    reason: t.confluence,
    status: normalizeOutcome(t.outcome) === 'open' ? 'open' : 'closed',
  }))

  const filtered = displayTrades.filter((t) => {
    const matchesQuery = t.symbol.toLowerCase().includes(query.trim().toLowerCase())
    if (tab === 'all') return matchesQuery
    if (tab === 'open') return matchesQuery && t.status === 'open'
    return matchesQuery && t.status === 'closed'
  })

  const openCount = displayTrades.filter((t) => t.status === 'open').length
  const closedCount = displayTrades.filter((t) => t.status === 'closed').length

  return (
    <div>
      <div className="animate-fade-up mt-4 flex items-center justify-between">
        <h1 className="font-display text-[19px] font-semibold">Journal</h1>
        {!accountsLoading && accounts.length > 0 && (
          <Link
            to="/add-trade"
            className="flex h-[38px] w-[38px] items-center justify-center rounded-xl border border-border bg-surface-2"
            aria-label="Add trade"
          >
            <IconPlus className="text-blue1" strokeWidth={2.2} />
          </Link>
        )}
      </div>

      {accountsLoading ? (
        <div className="animate-fade-up mt-5 flex justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-blue1" />
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState className="mt-10" style={{ animationDelay: '0.04s' }}>
          <p className="text-sm text-ink-3">
            Create a trading account to start journaling your trades.
          </p>
        </EmptyState>
      ) : (
        <>
          <div className="animate-fade-up mt-4 flex items-center gap-2.5" style={{ animationDelay: '0.04s' }}>
            <div className="flex flex-1 items-center gap-2.5 rounded-[14px] border border-border bg-surface-2 px-3.5 py-3">
              <IconSearch className="text-ink-2/70" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search symbol…"
                className="w-full bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-3"
              />
            </div>
            <button
              type="button"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-border bg-surface-2"
              aria-label="Filter trades"
            >
              <IconFilter className="text-ink-2" />
            </button>
          </div>

          <div className="animate-fade-up mt-4 flex gap-2" style={{ animationDelay: '0.06s' }}>
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`relative rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                  tab === t.key
                    ? 'bg-gradient-to-br from-blue1 to-blue2 text-[#0b0d13]'
                    : 'bg-surface-2 text-ink-2'
                }`}
              >
                {t.label}
                {t.key === 'open' && openCount > 0 && (
                  <span className="ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-mint/20 px-1 text-[10px] font-bold text-mint">
                    {openCount}
                  </span>
                )}
                {t.key === 'closed' && closedCount > 0 && (
                  <span className="ml-1.5 inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue1/20 px-1 text-[10px] font-bold text-blue1">
                    {closedCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-col gap-2.5">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-blue1" />
              </div>
            ) : (
              <>
                {filtered.map((trade, i) => (
                  <TradeCard key={trade.id} trade={trade} delay={0.04 * i} />
                ))}
                {filtered.length === 0 && !loading && (
                  <div className="animate-fade-up rounded-3xl border border-border bg-gradient-to-b from-white/[0.07] to-white/[0.045] p-8 text-center text-sm text-ink-3">
                    {query
                      ? `No trades match "${query}".`
                      : tab === 'open'
                        ? 'No open trades. All your trades are closed!'
                        : tab === 'closed'
                          ? 'No closed trades yet. Close some trades to see them here.'
                          : 'No trades yet. Add your first trade!'}
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
