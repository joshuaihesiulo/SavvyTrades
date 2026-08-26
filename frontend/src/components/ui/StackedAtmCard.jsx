import AtmCard from './AtmCard'

export default function StackedAtmCard({
  account,
  active = false,
  shadowClass = 'shadow-card',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        aria-hidden
        className="absolute inset-x-3 -bottom-3 h-5 rounded-[32px] bg-black/30 blur-[1px]"
      />
      <div
        aria-hidden
        className="absolute inset-x-2 -bottom-5 h-6 rounded-[32px] bg-black/20 blur-[1px]"
      />
      <div
        aria-hidden
        className="absolute inset-x-1 -bottom-7 h-7 rounded-[32px] bg-black/10 blur-[1px]"
      />
      <AtmCard
        size="sm"
        name={account.name}
        balance={account.currentBalance ?? account.balance}
        pl={account.percentChange ?? account.pl}
        shadowClass={shadowClass}
        className="w-full"
      />
      {active && (
        <span className="absolute right-4 top-3.5 z-[5] rounded-full border border-mint/30 bg-mint/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.06em] text-mint">
          ● Active
        </span>
      )}
    </div>
  )
}