import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAccounts } from '../hooks/useData'
import { IconCamera, IconX } from '../components/Icons'
import PageHeader from '../components/ui/PageHeader'
import GlassCard from '../components/ui/GlassCard'
import Input from '../components/ui/Input'
import OptionChip from '../components/ui/OptionChip'
import Button from '../components/ui/Button'
import EmptyState from '../components/ui/EmptyState'

function UploadBox({ filename, onFile }) {
  return (
    <label className="flex cursor-pointer flex-col items-center gap-2 rounded-[24px] border-[1.5px] border-dashed border-border-strong bg-surface-2 px-4 py-5 text-center transition hover:border-border-strong/50">
      <IconCamera className="text-ink-2" />
      <span className="text-[12.5px] font-semibold text-ink-3">
        {filename || 'Tap to upload chart image'}
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files[0] || null)}
      />
    </label>
  )
}

export default function AddTrade() {
  const navigate = useNavigate()
  const { accounts, loading: accountsLoading } = useAccounts()
  const [symbol, setSymbol] = useState('')
  const [direction, setDirection] = useState('buy')
  const [outcome, setOutcome] = useState('open')
  const [pnl, setPnl] = useState('')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [accountId, setAccountId] = useState('')
  const [beforeFile, setBeforeFile] = useState(null)
  const [afterFile, setAfterFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [screenshotErrors, setScreenshotErrors] = useState([])

  const activeAccountId = accountId || accounts[0]?.id || ''
  const isClosed = outcome !== 'open'

  function validatePnl(value, selectedOutcome) {
    const num = parseFloat(value)
    if (isNaN(num) || value === '') return ''
    if (selectedOutcome === 'win' && num <= 0) return 'Winning trades must have a positive P/L'
    if (selectedOutcome === 'loss' && num >= 0) return 'Losing trades must have a negative P/L'
    if (selectedOutcome === 'be' && num !== 0) return 'Break-even trades must have P/L of $0'
    return ''
  }

  function handleOutcomeChange(newOutcome) {
    setOutcome(newOutcome)
    if (newOutcome === 'open') {
      setPnl('')
    } else if (newOutcome === 'be') {
      setPnl('0')
    } else {
      setPnl('')
    }
  }

  function handlePnlChange(e) {
    const val = e.target.value
    if (val === '' || val === '-' || val === '.' || val === '-.') {
      setPnl(val)
      return
    }
    const num = parseFloat(val)
    if (!isNaN(num)) {
      setPnl(val)
    }
  }

  async function handleSubmit() {
    if (!symbol.trim() || !activeAccountId) {
      setError('Please fill in symbol and select an account')
      return
    }
    if (isClosed) {
      const pnlError = validatePnl(pnl || '0', outcome)
      if (pnlError) {
        setError(pnlError)
        return
      }
    }
    setError('')
    setSubmitting(true)
    try {
      const outcomeMap = { win: 'WIN', loss: 'LOSS', be: 'BREAK_EVEN', open: 'OPEN' }
      const tradeData = {
        tradingAccountId: activeAccountId,
        symbol: symbol.trim().toUpperCase(),
        direction: direction.toUpperCase(),
        outcome: outcomeMap[outcome] || 'OPEN',
        pnl: isClosed ? (pnl ? parseFloat(pnl) : 0) : 0,
        confluence: reason || undefined,
        notes: notes || undefined,
        openedAt: new Date().toISOString(),
        closedAt: isClosed ? new Date().toISOString() : null,
      }
      const result = await api.post('/trades', tradeData)

      const screenshotPromises = []
      const screenshotFailures = []
      if (beforeFile && result.trade) {
        const fd = new FormData()
        fd.append('image', beforeFile)
        fd.append('screenshotType', 'BEFORE')
        screenshotPromises.push(
          api.upload(`/trades/${result.trade.id}/screenshots`, fd).catch((err) => {
            screenshotFailures.push(`Before screenshot: ${err.message}`)
          })
        )
      }
      if (afterFile && result.trade) {
        const fd = new FormData()
        fd.append('image', afterFile)
        fd.append('screenshotType', 'AFTER')
        screenshotPromises.push(
          api.upload(`/trades/${result.trade.id}/screenshots`, fd).catch((err) => {
            screenshotFailures.push(`After screenshot: ${err.message}`)
          })
        )
      }

      await Promise.all(screenshotPromises)

      if (screenshotFailures.length > 0) {
        setScreenshotErrors(screenshotFailures)
        return
      }

      navigate('/journal')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="animate-fade-up">
        <PageHeader
          backTo="/dashboard"
          icon={IconX}
          title="Add Trade"
          sub={accounts.find((a) => a.id === activeAccountId)?.name || 'Select an account'}
        />
      </div>

      {accountsLoading ? (
        <div className="animate-fade-up mt-5 flex justify-center py-20">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-blue1" />
        </div>
      ) : accounts.length === 0 ? (
        <EmptyState className="mt-10" style={{ animationDelay: '0.02s' }}>
          <p className="text-sm text-ink-3">
            You need a trading account before you can log your first trade.
          </p>
        </EmptyState>
      ) : (
        <>
          {error && (
            <div className="animate-fade-up mt-4 rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-[13px] text-rose">
              {error}
            </div>
          )}

          {screenshotErrors.length > 0 && (
            <div className="animate-fade-up mt-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-[13px] text-amber-500">
              <p className="font-semibold">Trade saved, but:</p>
              <ul className="mt-1 list-disc pl-4">
                {screenshotErrors.map((msg, i) => (
                  <li key={i}>{msg}</li>
                ))}
              </ul>
            </div>
          )}

          {accounts.length > 1 && (
            <GlassCard className="animate-fade-up mt-5 p-[18px]" style={{ animationDelay: '0.02s' }}>
              <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">Account</span>
              <div className="mt-2 grid grid-cols-2 gap-2.5">
                {accounts.map((a) => (
                  <OptionChip key={a.id} selected={activeAccountId === a.id} onClick={() => setAccountId(a.id)}>
                    {a.name}
                  </OptionChip>
                ))}
              </div>
            </GlassCard>
          )}

          <GlassCard className="animate-fade-up mt-5 p-[18px]" style={{ animationDelay: '0.04s' }}>
            <Input
              label="Pair / Symbol"
              placeholder="e.g. XAUUSD"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <div className="mt-4">
              <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">
                Direction
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDirection('buy')}
                  className={`rounded-[14px] border px-4 py-3.5 text-sm font-bold transition ${
                    direction === 'buy'
                      ? 'border-mint/40 bg-mint/15 text-mint'
                      : 'border-border bg-surface-2 text-ink-2'
                  }`}
                >
                  ▲ Buy
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('sell')}
                  className={`rounded-[14px] border px-4 py-3.5 text-sm font-bold transition ${
                    direction === 'sell'
                      ? 'border-rose/40 bg-rose/15 text-rose'
                      : 'border-border bg-surface-2 text-ink-2'
                  }`}
                >
                  ▼ Sell
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.09s' }}>
            <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">Outcome</span>
            <div className="mt-2 grid grid-cols-2 gap-2.5">
              <OptionChip selected={outcome === 'win'} onClick={() => handleOutcomeChange('win')}>
                Win
              </OptionChip>
              <OptionChip selected={outcome === 'loss'} onClick={() => handleOutcomeChange('loss')}>
                Loss
              </OptionChip>
              <OptionChip selected={outcome === 'be'} onClick={() => handleOutcomeChange('be')}>
                Break-even
              </OptionChip>
              <OptionChip selected={outcome === 'open'} onClick={() => handleOutcomeChange('open')}>
                Open
              </OptionChip>
            </div>
            <div className="mt-4">
              <Input
                label="Profit / Loss ($)"
                placeholder={outcome === 'open' ? 'Disabled for open trades' : outcome === 'be' ? '0' : outcome === 'win' ? '842.50' : '-842.50'}
                type="number"
                step="0.01"
                value={pnl}
                onChange={handlePnlChange}
                disabled={outcome === 'open'}
              />
              {outcome === 'win' && pnl && parseFloat(pnl) <= 0 && (
                <p className="mt-1.5 text-[12px] text-rose">Must be positive for a winning trade</p>
              )}
              {outcome === 'loss' && pnl && parseFloat(pnl) >= 0 && (
                <p className="mt-1.5 text-[12px] text-rose">Must be negative for a losing trade</p>
              )}
              {outcome === 'be' && pnl && parseFloat(pnl) !== 0 && (
                <p className="mt-1.5 text-[12px] text-rose">Must be $0 for break-even</p>
              )}
              {outcome === 'open' && (
                <p className="mt-1.5 text-[12px] text-ink-3">P/L is set when the trade is closed</p>
              )}
            </div>
          </GlassCard>

          <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.14s' }}>
            <Input
              label="Trade reason"
              placeholder="e.g. Order block retest"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="mt-4">
              <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">Notes</span>
              <textarea
                className="min-h-[88px] w-full resize-none rounded-[18px] border border-border bg-surface-2 px-4 py-[15px] text-[15px] text-ink outline-none transition placeholder:text-ink-3 focus:border-blue1 focus:ring-4 focus:ring-blue1/15"
                placeholder="Context, emotions, execution quality…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </GlassCard>

          <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.19s' }}>
            <span className="mb-3 block text-xs font-semibold tracking-wide text-ink-2">
              Before-trade screenshot
            </span>
            <UploadBox filename={beforeFile?.name || ''} onFile={setBeforeFile} />
          </GlassCard>

          <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.19s' }}>
            <span className="mb-3 block text-xs font-semibold tracking-wide text-ink-2">
              After-trade screenshot
            </span>
            <UploadBox filename={afterFile?.name || ''} onFile={setAfterFile} />
          </GlassCard>

          <div className="animate-fade-up mt-7" style={{ animationDelay: '0.24s' }}>
            {screenshotErrors.length > 0 ? (
              <Button onClick={() => navigate('/journal')}>
                Continue to journal
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Saving…' : 'Save Trade'}
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
