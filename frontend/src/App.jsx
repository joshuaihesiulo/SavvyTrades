import { Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import AuthLayout from './components/layout/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import NewAccount from './pages/NewAccount'
import EditAccount from './pages/EditAccount'
import Dashboard from './pages/Dashboard'
import Accounts from './pages/Accounts'
import AddTrade from './pages/AddTrade'
import Journal from './pages/Journal'
import TradeDetail from './pages/TradeDetail'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell withNav />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/add-trade" element={<AddTrade />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route element={<AppShell />}>
          <Route path="/new-account" element={<NewAccount />} />
          <Route path="/edit-account/:id" element={<EditAccount />} />
          <Route path="/accounts" element={<Accounts />} />
          <Route path="/trade/:id" element={<TradeDetail />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
