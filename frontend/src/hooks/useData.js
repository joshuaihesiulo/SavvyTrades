import { useState, useEffect } from 'react'
import { api } from '../lib/api'

export function useAccounts() {
  const [accounts, setAccounts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function refetch() {
    setLoading(true)
    setError(null)
    api
      .get('/accounts')
      .then((data) => setAccounts(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refetch()
  }, [])

  return { accounts, loading, error, refetch }
}

export function useDashboard(accountId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!accountId) return
    setLoading(true)
    setError(null)
    api
      .get(`/accounts/${accountId}/dashboard`)
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [accountId])

  return { data, loading, error }
}

export function useAccountStats(accountId) {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!accountId) return
    setLoading(true)
    setError(null)
    api
      .get(`/accounts/${accountId}/stats`)
      .then((d) => setStats(d.stats))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [accountId])

  return { stats, loading, error }
}

export function useTrades(accountId, params = {}) {
  const [trades, setTrades] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  function refetch(extraParams = {}) {
    if (!accountId) return
    setLoading(true)
    setError(null)
    const query = new URLSearchParams({ tradingAccountId: accountId, ...params, ...extraParams }).toString()
    api
      .get(`/trades?${query}`)
      .then((d) => {
        setTrades(d.trades)
        setPagination(d.pagination)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    refetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId])

  return { trades, pagination, loading, error, refetch }
}

export function useTrade(id) {
  const [trade, setTrade] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    api
      .get(`/trades/${id}`)
      .then((d) => setTrade(d.trade))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  return { trade, loading, error }
}

export function useEquityCurve(accountId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!accountId) return
    setLoading(true)
    setError(null)
    api
      .get(`/accounts/${accountId}/equity-curve`)
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [accountId])

  return { data, loading, error }
}
