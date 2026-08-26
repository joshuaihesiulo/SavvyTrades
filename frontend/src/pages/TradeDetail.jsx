import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useTrade } from '../hooks/useData'
import { fmtPL, fmtDateTime, normalizeDirection, normalizeOutcome } from '../utils'
import { api } from '../lib/api'
import PageHeader from '../components/ui/PageHeader'
import GlassCard from '../components/ui/GlassCard'
import Pill from '../components/ui/Pill'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import OptionChip from '../components/ui/OptionChip'

function Shot({ color, gradientId }) {
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor={color} stopOpacity="0.25" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 70 L15 60 L30 65 L45 45 L60 50 L75 30 L100 20 L100 100 L0 100 Z"
        fill={`url(#${gradientId})`}
      />
      <path
        d="M0 70 L15 60 L30 65 L45 45 L60 50 L75 30 L100 20"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  )
}

function InfoRow({ k, v, vClass = '' }) {
  return (
    <div className="flex justify-between border-b border-border py-3 text-[13.5px] last:border-b-0">
      <span className="text-ink-3">{k}</span>
      <span className={`font-semibold ${vClass}`}>{v}</span>
    </div>
  )
}

export default function TradeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { trade, loading, error } = useTrade(id)
  const [screenshots, setScreenshots] = useState({ before: [], after: [] })
  const [editing, setEditing] = useState(false)
  const [editData, setEditData] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    if (!id) return
    api
      .get(`/trades/${id}/screenshots`)
      .then((data) => setScreenshots({ before: data.before || [], after: data.after || [] }))
      .catch(() => {})
  }, [id])

  useEffect(() => {
    if (trade) {
      setEditData({
        symbol: trade.symbol,
        direction: trade.direction,
        outcome: trade.outcome,
        pnl: trade.pnl ?? 0,
        confluence: trade.confluence || '',
        notes: trade.notes || '',
      })
    }
  }, [trade])

  async function handleSave() {
    setSaving(true)
    try {
      const outcomeMap = { WIN: 'WIN', LOSS: 'LOSS', BREAK_EVEN: 'BREAK_EVEN', OPEN: 'OPEN' }
      await api.put(`/trades/${id}`, {
        symbol: editData.symbol,
        direction: editData.direction,
        outcome: outcomeMap[editData.outcome] || editData.outcome,
        pnl: parseFloat(editData.pnl) || 0,
        confluence: editData.confluence || null,
        notes: editData.notes || null,
      })
      setEditing(false)
      window.location.reload()
    } catch (err) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/trades/${id}`)
      navigate('/journal')
    } catch (err) {
      alert(err.message)
    } finally {
      setDeleting(false)
    }
  }

  async function handleDeleteScreenshot(screenshotId) {
    if (!confirm('Delete this screenshot?')) return
    try {
      await api.delete(`/trades/${id}/screenshots/${screenshotId}`)
      setScreenshots((prev) => ({
        before: prev.before.filter((s) => s.id !== screenshotId),
        after: prev.after.filter((s) => s.id !== screenshotId),
      }))
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-blue1" />
      </div>
    )
  }

  if (error || !trade) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-2xl font-semibold">Trade not found</h1>
        <p className="mt-2 text-sm text-ink-3">This journal entry doesn't exist anymore.</p>
        <Link
          to="/journal"
          className="mt-8 rounded-2xl bg-gradient-to-br from-blue1 to-blue2 px-6 py-3.5 text-sm font-bold text-[#0b0d13] shadow-primary transition hover:brightness-105"
        >
          Back to Journal
        </Link>
      </div>
    )
  }

  const direction = normalizeDirection(trade.direction)
  const outcome = normalizeOutcome(trade.outcome)
  const isOpen = outcome === 'open'
  const outcomeClass = isOpen ? 'neutral' : outcome === 'win' ? 'mint' : outcome === 'loss' ? 'rose' : 'amber'

  return (
    <div>
      <div className="animate-fade-up">
        <PageHeader
          backTo="/journal"
          title={trade.symbol}
          sub={trade.openedAt ? fmtDateTime(trade.openedAt) : ''}
        />
      </div>

      {!editing && (
        <div className="animate-fade-up mt-3 flex gap-2" style={{ animationDelay: '0.02s' }}>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex-1 rounded-2xl border border-border bg-surface-2 px-4 py-2.5 text-[13px] font-semibold text-ink-2 transition hover:border-border-strong"
          >
            Edit Trade
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-2.5 text-[13px] font-semibold text-rose transition hover:bg-rose/20"
          >
            Delete
          </button>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="animate-fade-up mt-3 rounded-2xl border border-rose/30 bg-rose/10 p-4">
          <p className="text-[13px] text-rose">Are you sure you want to delete this trade?</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-xl bg-rose px-4 py-2 text-[13px] font-bold text-white transition hover:brightness-110 disabled:opacity-50"
            >
              {deleting ? 'Deleting…' : 'Yes, Delete'}
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-2 text-[13px] font-semibold text-ink-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {editing ? (
        <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.04s' }}>
          <Input
            label="Symbol"
            value={editData.symbol}
            onChange={(e) => setEditData({ ...editData, symbol: e.target.value.toUpperCase() })}
          />
          <div className="mt-4">
            <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">Direction</span>
            <div className="grid grid-cols-2 gap-2.5">
              <OptionChip
                selected={editData.direction === 'BUY'}
                onClick={() => setEditData({ ...editData, direction: 'BUY' })}
              >
                ▲ Buy
              </OptionChip>
              <OptionChip
                selected={editData.direction === 'SELL'}
                onClick={() => setEditData({ ...editData, direction: 'SELL' })}
              >
                ▼ Sell
              </OptionChip>
            </div>
          </div>
          <div className="mt-4">
            <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">Outcome</span>
            <div className="grid grid-cols-2 gap-2.5">
              {['WIN', 'LOSS', 'BREAK_EVEN', 'OPEN'].map((o) => (
                <OptionChip
                  key={o}
                  selected={editData.outcome === o}
                  onClick={() => {
                    const newOutcome = o
                    const newPnl = newOutcome === 'OPEN' ? 0 : newOutcome === 'BREAK_EVEN' ? 0 : editData.pnl
                    setEditData({ ...editData, outcome: newOutcome, pnl: newPnl })
                  }}
                >
                  {o === 'BREAK_EVEN' ? 'Break-even' : o === 'OPEN' ? 'Open' : o.charAt(0) + o.slice(1).toLowerCase()}
                </OptionChip>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <Input
              label="P/L ($)"
              type="number"
              step="0.01"
              value={editData.pnl}
              onChange={(e) => setEditData({ ...editData, pnl: e.target.value })}
              disabled={editData.outcome === 'OPEN'}
            />
          </div>
          <div className="mt-4">
            <Input
              label="Trade reason"
              value={editData.confluence}
              onChange={(e) => setEditData({ ...editData, confluence: e.target.value })}
            />
          </div>
          <div className="mt-4">
            <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">Notes</span>
            <textarea
              className="min-h-[88px] w-full resize-none rounded-[18px] border border-border bg-surface-2 px-4 py-[15px] text-[15px] text-ink outline-none transition placeholder:text-ink-3 focus:border-blue1 focus:ring-4 focus:ring-blue1/15"
              value={editData.notes}
              onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
            />
          </div>
          <div className="mt-5 flex gap-2">
            <Button onClick={handleSave} disabled={saving} className="flex-1">
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="flex-1 rounded-2xl border border-border bg-surface-2 px-4 py-3 text-[13px] font-semibold text-ink-2"
            >
              Cancel
            </button>
          </div>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="animate-fade-up mt-4 p-5" style={{ animationDelay: '0.04s' }}>
            <div className="flex items-center gap-2">
              <Pill variant={isOpen ? 'neutral' : direction === 'buy' ? 'mint' : 'rose'}>
                {isOpen ? '● Open' : direction === 'buy' ? '▲ Buy' : '▼ Sell'}
              </Pill>
              <Pill variant={outcomeClass} className="capitalize">
                {isOpen ? 'Open' : outcome === 'be' ? 'Break-even' : outcome}
              </Pill>
            </div>
            <div className="mt-4 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-ink-3">
              Profit / Loss
            </div>
            <div
              className={`mt-1 font-display text-[30px] font-semibold tabular-nums tracking-tight ${
                isOpen ? 'text-ink-3' : outcome === 'win'
                  ? 'text-mint'
                  : outcome === 'loss'
                    ? 'text-rose'
                    : 'text-amber'
              }`}
            >
              {isOpen ? '—' : fmtPL(trade.pnl ?? 0)}
            </div>
          </GlassCard>

          <GlassCard className="animate-fade-up mt-4 px-[18px] py-3" style={{ animationDelay: '0.09s' }}>
            <InfoRow k="Symbol" v={trade.symbol} />
            <InfoRow k="Direction" v={direction === 'buy' ? 'Buy' : 'Sell'} />
            <InfoRow
              k="Outcome"
              v={isOpen ? 'Open' : outcome === 'win' ? 'Win' : outcome === 'loss' ? 'Loss' : 'Break-even'}
              vClass={isOpen ? 'text-ink-3' : outcome === 'loss' ? 'text-rose' : outcome === 'win' ? 'text-mint' : 'text-amber'}
            />
            {trade.confluence && <InfoRow k="Trade reason" v={trade.confluence} />}
          </GlassCard>

          {trade.notes && (
            <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.16s' }}>
              <span className="text-xs font-semibold tracking-wide text-ink-2">Notes</span>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-ink-2">{trade.notes}</p>
            </GlassCard>
          )}

          <div className="animate-fade-up mt-5" style={{ animationDelay: '0.22s' }}>
            <div className="font-display text-[15px] font-semibold">Screenshots</div>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              {screenshots.before.length > 0 ? (
                screenshots.before.map((s) => (
                  <div key={s.id} className="relative aspect-[1/1.1] overflow-hidden rounded-2xl border border-border group">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                      <img src={s.url} alt={s.caption || 'Before'} className="h-full w-full object-cover" />
                    </a>
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-ink-2 backdrop-blur-md">
                      Before
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteScreenshot(s.id)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-rose opacity-0 transition group-hover:opacity-100 hover:bg-black/80"
                      aria-label="Delete screenshot"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="relative aspect-[1/1.1] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#1c2230] to-[#141821]">
                  <Shot color="#3fd9ac" gradientId="shot-before" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-ink-2 backdrop-blur-md">
                    Before
                  </span>
                </div>
              )}
              {screenshots.after.length > 0 ? (
                screenshots.after.map((s) => (
                  <div key={s.id} className="relative aspect-[1/1.1] overflow-hidden rounded-2xl border border-border group">
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
                      <img src={s.url} alt={s.caption || 'After'} className="h-full w-full object-cover" />
                    </a>
                    <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-ink-2 backdrop-blur-md">
                      After
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteScreenshot(s.id)}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-rose opacity-0 transition group-hover:opacity-100 hover:bg-black/80"
                      aria-label="Delete screenshot"
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="relative aspect-[1/1.1] overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-[#1c2230] to-[#141821]">
                  <Shot color="#7c93ff" gradientId="shot-after" />
                  <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold tracking-wide text-ink-2 backdrop-blur-md">
                    After
                  </span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
