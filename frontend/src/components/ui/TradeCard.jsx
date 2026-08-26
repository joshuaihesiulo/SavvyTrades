import { Link } from 'react-router-dom'
import GlassCard from './GlassCard'
import Pill from './Pill'
import { fmtPL } from '../../utils'

export default function TradeCard({ trade, delay = 0 }) {
  const isOpen = trade.outcome === 'open' || trade.status === 'open'
  const plClass = isOpen
    ? 'text-ink-3'
    : trade.outcome === 'win'
      ? 'text-mint'
      : trade.outcome === 'loss'
        ? 'text-rose'
        : 'text-amber'
  return (
    <Link
      to={`/trade/${trade.id}`}
      className="animate-fade-up block"
      style={{ animationDelay: `${delay}s` }}
    >
      <GlassCard className="flex items-center justify-between gap-2.5 px-4 py-[15px] transition-colors hover:border-border-strong">
        <div className="flex items-center gap-3">
          <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[13px] bg-surface-3 text-[11px] font-extrabold tracking-tight text-ink-2">
            {trade.badge}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[14.5px] font-bold">{trade.symbol}</span>
              {isOpen && (
                <span className="inline-flex h-[18px] items-center rounded-full bg-amber/15 px-2 text-[10px] font-bold text-amber">
                  OPEN
                </span>
              )}
            </div>
            <div className="mt-[3px] text-[11.5px] text-ink-3">
              {trade.date} · {trade.time}
            </div>
          </div>
        </div>
        <div className="text-right">
          <Pill variant={isOpen ? 'neutral' : trade.direction === 'buy' ? 'mint' : 'rose'}>
            {isOpen ? '● Open' : trade.direction === 'buy' ? '▲ Buy' : '▼ Sell'}
          </Pill>
          <div className={`mt-2 text-[15px] font-bold tabular-nums ${plClass}`}>
            {isOpen ? '—' : fmtPL(trade.pl)}
          </div>
        </div>
      </GlassCard>
    </Link>
  )
}
