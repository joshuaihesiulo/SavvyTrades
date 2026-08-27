import { Link } from 'react-router-dom'
import { LogoMark, IconGrid, IconJournal, IconCamera, IconShield, IconChevronRight } from '../components/Icons'

const features = [
  {
    icon: IconGrid,
    title: 'Multi-Account Tracking',
    desc: 'Manage prop firms, personal accounts, and demos in one place. Each account gets its own ATM-style card with real-time balance and P&L.',
  },
  {
    icon: IconJournal,
    title: 'Trade Journal',
    desc: 'Log every trade with symbol, direction, outcome, and notes. Build a searchable record that reveals your edge over time.',
  },
  {
    icon: IconCamera,
    title: 'Screenshot Capture',
    desc: 'Attach before and after charts to every trade. Review your entries and exits with visual context, not just numbers.',
  },
  {
    icon: IconShield,
    title: 'Private Bank Aesthetic',
    desc: 'Dark glass surfaces, gold-accented cards, and understated typography. Your journal feels as serious as your capital.',
  },
]

export default function Landing() {
  return (
    <div className="bg-page-glows min-h-dvh font-sans text-ink antialiased">
      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="animate-fade-up sticky top-0 z-50 border-b border-border bg-page/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-gradient-to-br from-blue1 to-blue2 shadow-[0_8px_20px_-4px_rgba(124,147,255,0.5)]">
              <LogoMark />
            </span>
            <span className="font-display text-[17px] font-bold tracking-tight">SavvyTrade</span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-ink-2 transition hover:text-ink">Features</a>
            <a href="#preview" className="text-sm text-ink-2 transition hover:text-ink">Preview</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="hidden rounded-xl border border-border-strong bg-white/[0.07] px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-white/[0.12] active:scale-[0.97] sm:inline-block"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-gradient-to-br from-blue1 to-blue2 px-5 py-2.5 text-sm font-bold text-[#0b0d13] shadow-primary transition hover:brightness-105 active:scale-[0.97]"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-blue1/[0.07] blur-[120px]" />
          <div className="absolute right-0 top-20 h-[400px] w-[500px] rounded-full bg-blue2/[0.06] blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-12 lg:pt-32 lg:pb-36">
          {/* Left – copy */}
          <div>
            <span
              className="animate-fade-up inline-flex w-fit items-center gap-2 rounded-full border border-border bg-white/[0.045] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-2"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-br from-mint to-blue1 shadow-[0_0_10px_rgba(63,217,172,0.8)]" />
              Premium Trading Journal
            </span>

            <h1
              className="animate-fade-up mt-7 font-display text-[clamp(38px,5.5vw,64px)] font-semibold leading-[1.04] tracking-[-0.025em]"
              style={{ animationDelay: '0.06s' }}
            >
              Your trading journal,{' '}
              <br className="hidden lg:block" />
              built like a{' '}
              <span className="bg-gradient-to-br from-blue1 to-blue2 bg-clip-text text-transparent">
                private bank app.
              </span>
            </h1>

            <p
              className="animate-fade-up mt-5 max-w-lg text-base leading-relaxed text-ink-2 lg:text-lg"
              style={{ animationDelay: '0.12s' }}
            >
              Dark, glass-surfaced, and understated. Log trades, review screenshots, and track
              performance with the polish of a digital bank — never a spreadsheet.
            </p>

            <div
              className="animate-fade-up mt-10 flex flex-wrap items-center gap-4"
              style={{ animationDelay: '0.18s' }}
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-blue1 to-blue2 px-7 py-4 text-[15px] font-bold text-[#0b0d13] shadow-primary transition hover:brightness-105 active:scale-[0.97]"
              >
                Start Free
                <IconChevronRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-border-strong bg-white/[0.07] px-7 py-4 text-[15px] font-bold text-ink transition hover:bg-white/[0.12] active:scale-[0.97]"
              >
                Log In
              </Link>
            </div>

            <div
              className="animate-fade-up mt-10 flex items-center gap-6 text-sm text-ink-3"
              style={{ animationDelay: '0.22s' }}
            >
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Free to use
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-mint" />
                Launch in seconds
              </span>
            </div>
          </div>

          {/* Right – ATM card mockup */}
          <div
            className="animate-fade-up relative mt-16 flex justify-center lg:mt-0"
            style={{ animationDelay: '0.14s' }}
          >
            <div className="relative">
              {/* glow behind card */}
              <div className="absolute -inset-10 rounded-full bg-blue1/[0.1] blur-[80px]" />

              {/* stacked shadow cards */}
              <div className="absolute inset-x-4 -bottom-3 h-full rounded-[32px] border border-border bg-surface-2" aria-hidden />
              <div className="absolute inset-x-8 -bottom-5 h-full rounded-[32px] border border-border bg-surface" aria-hidden />

              {/* main ATM card */}
              <div className="landing-atm relative z-[1] w-[340px] overflow-hidden rounded-[32px] border border-white/10 p-7 sm:w-[380px] lg:w-[400px]" style={{ height: 220 }}>
                <div className="sheen pointer-events-none absolute inset-0" />
                <div className="relative z-[1] flex items-start justify-between">
                  <div className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.06em] text-gold1">
                    <span>◆</span> SavvyTrade
                  </div>
                  <div className="h-7 w-[38px] rounded-[6px] bg-gradient-to-br from-gold1 to-gold2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]" />
                </div>
                <div className="relative z-[1] mt-5 text-[12px] uppercase tracking-[0.04em] text-ink-3">
                  Current Balance
                </div>
                <div className="relative z-[1] mt-1.5 font-display text-[34px] font-semibold tabular-nums tracking-tight">
                  $24,850.00
                </div>
                <div className="relative z-[1] mt-5 flex items-end justify-between">
                  <div className="text-[13px] font-semibold text-ink-2">Prop Firm Account</div>
                  <div className="text-[13px] font-bold text-mint">+12.40%</div>
                </div>
              </div>

              {/* floating stat badge */}
              <div className="animate-float absolute -right-6 top-8 z-[2] rounded-2xl border border-border bg-surface/90 px-4 py-3 shadow-soft backdrop-blur-xl">
                <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-ink-3">Win Rate</div>
                <div className="mt-1 font-display text-lg font-bold text-mint">68.5%</div>
              </div>

              {/* floating stat badge 2 */}
              <div className="animate-float-delay absolute -left-8 bottom-12 z-[2] rounded-2xl border border-border bg-surface/90 px-4 py-3 shadow-soft backdrop-blur-xl">
                <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-ink-3">Total P&L</div>
                <div className="mt-1 font-display text-lg font-bold text-mint">+$3,240</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="relative border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="animate-fade-up text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.045] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink-2">
              Features
            </span>
            <h2 className="animate-fade-up mt-5 font-display text-[clamp(28px,3.5vw,42px)] font-semibold tracking-tight" style={{ animationDelay: '0.06s' }}>
              Everything you need to{' '}
              <span className="bg-gradient-to-br from-blue1 to-blue2 bg-clip-text text-transparent">
                trade smarter
              </span>
            </h2>
            <p className="animate-fade-up mx-auto mt-4 max-w-lg text-base text-ink-2" style={{ animationDelay: '0.1s' }}>
              Built for traders who take their craft seriously. No fluff, no noise — just the tools that matter.
            </p>
          </div>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="animate-fade-up group rounded-[24px] border border-border bg-gradient-to-b from-white/[0.07] to-white/[0.045] p-6 backdrop-blur-[20px] transition hover:border-border-strong hover:from-white/[0.09] hover:to-white/[0.06]"
                style={{ animationDelay: `${0.08 + i * 0.06}s` }}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue1/20 to-blue2/20 text-blue1 transition group-hover:from-blue1/30 group-hover:to-blue2/30">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-[17px] font-semibold">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-2">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dashboard Preview ──────────────────────────────── */}
      <section id="preview" className="relative overflow-hidden border-t border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue2/[0.06] blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="animate-fade-up text-center">
            <h2 className="font-display text-[clamp(28px,3.5vw,42px)] font-semibold tracking-tight">
              A dashboard that feels{' '}
              <span className="bg-gradient-to-br from-blue1 to-blue2 bg-clip-text text-transparent">
                like home
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base text-ink-2">
              At-a-glance stats, your ATM card, and performance metrics — all on one screen.
            </p>
          </div>

          {/* Mock dashboard */}
          <div
            className="animate-fade-up mx-auto mt-14 max-w-3xl rounded-[32px] border border-border bg-surface/80 p-6 shadow-card backdrop-blur-xl sm:p-8 lg:mt-20"
            style={{ animationDelay: '0.1s' }}
          >
            {/* top bar */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-ink-3">Good evening</div>
                <div className="font-display text-lg font-bold">Alex</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-gradient-to-br from-blue1 to-blue2 font-display text-sm font-bold text-[#0b0d13]">
                AM
              </div>
            </div>

            {/* mini ATM card */}
            <div className="mt-6 overflow-hidden rounded-[28px] border border-white/10 p-5" style={{ height: 170 }}>
              <div className="sheen pointer-events-none absolute inset-0" />
              <div className="relative z-[1] flex items-start justify-between">
                <div className="text-[11px] font-bold uppercase tracking-[0.06em] text-gold1">
                  <span>◆</span> SavvyTrade
                </div>
                <div className="h-[22px] w-[30px] rounded-[6px] bg-gradient-to-br from-gold1 to-gold2 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)]" />
              </div>
              <div className="relative z-[1] mt-3.5 text-[11px] uppercase tracking-[0.04em] text-ink-3">
                Current Balance
              </div>
              <div className="relative z-[1] mt-1 font-display text-[24px] font-semibold tabular-nums tracking-tight">
                $24,850.00
              </div>
              <div className="relative z-[1] mt-3 flex items-end justify-between">
                <div className="text-[12px] font-semibold text-ink-2">Prop Firm Account</div>
                <div className="text-[11px] font-bold text-mint">+12.40%</div>
              </div>
            </div>

            {/* stat grid */}
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: 'Total Trades', value: '142', color: '' },
                { label: 'Win Rate', value: '68.5%', color: 'text-mint' },
                { label: 'Total P&L', value: '+$3,240', color: 'text-mint' },
                { label: 'Wins', value: '97', color: 'text-mint' },
                { label: 'Losses', value: '41', color: 'text-rose' },
                { label: 'Profit Factor', value: '2.14', color: '' },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-[20px] border border-border bg-gradient-to-b from-white/[0.07] to-white/[0.045] p-4"
                >
                  <div className="text-[10px] font-semibold uppercase tracking-[0.05em] text-ink-3">{s.label}</div>
                  <div className={`mt-1.5 font-display text-[19px] font-semibold tabular-nums ${s.color}`}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────── */}
      <section className="relative border-t border-border">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 bottom-0 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-blue1/[0.08] blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-3xl px-6 py-24 text-center lg:py-32">
          <h2
            className="animate-fade-up font-display text-[clamp(30px,4vw,48px)] font-semibold leading-[1.1] tracking-tight"
          >
            Stop journaling in spreadsheets.{' '}
            <span className="bg-gradient-to-br from-blue1 to-blue2 bg-clip-text text-transparent">
              Start trading like a pro.
            </span>
          </h2>
          <p
            className="animate-fade-up mx-auto mt-5 max-w-md text-base text-ink-2"
            style={{ animationDelay: '0.06s' }}
          >
            Join SavvyTrade and give your trading the tool it deserves. Free to start, no strings attached.
          </p>
          <div
            className="animate-fade-up mt-10 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: '0.12s' }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-br from-blue1 to-blue2 px-8 py-4 text-[15px] font-bold text-[#0b0d13] shadow-primary transition hover:brightness-105 active:scale-[0.97]"
            >
              Create Free Account
              <IconChevronRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-border-strong bg-white/[0.07] px-8 py-4 text-[15px] font-bold text-ink transition hover:bg-white/[0.12] active:scale-[0.97]"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row lg:px-12">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-gradient-to-br from-blue1 to-blue2">
              <LogoMark />
            </span>
            <span className="font-display text-sm font-bold tracking-tight">SavvyTrade</span>
          </div>
          <p className="text-xs text-ink-3">&copy; {new Date().getFullYear()} SavvyTrade. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-ink-3 transition hover:text-ink">Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="text-xs text-ink-3 transition hover:text-ink">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
