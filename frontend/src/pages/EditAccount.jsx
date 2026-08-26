import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../lib/api'
import PageHeader from '../components/ui/PageHeader'
import GlassCard from '../components/ui/GlassCard'
import Input from '../components/ui/Input'
import OptionChip from '../components/ui/OptionChip'
import Button from '../components/ui/Button'

const markets = ['Forex', 'Indices', 'Crypto', 'Futures']
const types = ['Prop Firm', 'Personal', 'Demo', 'Managed']

export default function EditAccount() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [accountName, setAccountName] = useState('')
  const [market, setMarket] = useState('Forex')
  const [type, setType] = useState('Prop Firm')
  const [startingBalance, setStartingBalance] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    api
      .get(`/trading-accounts/${id}`)
      .then((data) => {
        const acc = data.account
        setAccountName(acc.accountName || '')
        setMarket(acc.market || 'Forex')
        setType(acc.accountType || 'Prop Firm')
        setStartingBalance(acc.startingBalance?.toString() || '')
        setCurrency(acc.currency || 'USD')
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit() {
    if (!accountName.trim()) {
      setError('Account name is required')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      await api.put(`/trading-accounts/${id}`, {
        accountName: accountName.trim(),
        market,
        accountType: type,
        startingBalance: startingBalance ? parseFloat(startingBalance) : 0,
        currency: currency.trim().toUpperCase() || 'USD',
      })
      navigate('/accounts')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)
    try {
      await api.delete(`/trading-accounts/${id}`)
      navigate('/accounts')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-blue1" />
      </div>
    )
  }

  return (
    <div>
      <div className="animate-fade-up">
        <PageHeader backTo="/accounts" title="Edit Account" sub="Update your trading account" />
      </div>

      {error && (
        <div className="animate-fade-up mt-4 rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-[13px] text-rose">
          {error}
        </div>
      )}

      <GlassCard className="animate-fade-up mt-5 p-[18px]" style={{ animationDelay: '0.04s' }}>
        <Input
          label="Account name"
          placeholder="e.g. Apex Capital — Live"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
        />
      </GlassCard>

      <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.09s' }}>
        <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">Market</span>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {markets.map((m) => (
            <OptionChip key={m} selected={market === m} onClick={() => setMarket(m)}>
              {m}
            </OptionChip>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.14s' }}>
        <span className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">
          Account type
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {types.map((t) => (
            <OptionChip key={t} selected={type === t} onClick={() => setType(t)}>
              {t}
            </OptionChip>
          ))}
        </div>
      </GlassCard>

      <GlassCard className="animate-fade-up mt-4 p-[18px]" style={{ animationDelay: '0.19s' }}>
        <div className="grid grid-cols-[1fr_104px] items-end gap-3">
          <Input
            label="Starting balance"
            placeholder="100,000"
            type="number"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
          />
          <Input
            label="Currency"
            placeholder="USD"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>
      </GlassCard>

      <div className="animate-fade-up mt-7 flex flex-col gap-3" style={{ animationDelay: '0.24s' }}>
        <Button onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Changes'}
        </Button>
        {!showDelete ? (
          <button
            type="button"
            onClick={() => setShowDelete(true)}
            className="rounded-2xl border border-rose/30 bg-rose/10 px-4 py-3 text-[13px] font-semibold text-rose transition hover:bg-rose/20"
          >
            Delete Account
          </button>
        ) : (
          <div className="rounded-2xl border border-rose/30 bg-rose/10 p-4">
            <p className="text-[13px] text-rose">This will permanently delete this account and all its trades. Are you sure?</p>
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
                onClick={() => setShowDelete(false)}
                className="flex-1 rounded-xl border border-border bg-surface-2 px-4 py-2 text-[13px] font-semibold text-ink-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
