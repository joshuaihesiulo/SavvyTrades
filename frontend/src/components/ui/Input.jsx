import { useState } from 'react'
import { IconEye, IconEyeOff } from '../Icons'

export default function Input({ label, icon: Icon, type, className = '', inputClassName = '', ...rest }) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  const base =
    'w-full rounded-[18px] border border-border bg-surface-2 py-[15px] text-[15px] text-ink outline-none transition placeholder:text-ink-3 focus:border-blue1 focus:ring-4 focus:ring-blue1/15 disabled:opacity-40 disabled:cursor-not-allowed'
  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-xs font-semibold tracking-wide text-ink-2">
          {label}
        </label>
      )}
      {Icon ? (
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-2/60">
            <Icon width={18} height={18} />
          </span>
          <input
            type={inputType}
            className={`${base} pl-12 ${isPassword ? 'pr-12' : 'pr-4'} ${inputClassName}`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-2/60 hover:text-ink-2 transition"
            >
              {showPassword ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
            </button>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type={inputType}
            className={`${base} px-4 ${isPassword ? 'pr-12' : ''} ${inputClassName}`}
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              tabIndex={-1}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-2/60 hover:text-ink-2 transition"
            >
              {showPassword ? <IconEyeOff width={18} height={18} /> : <IconEye width={18} height={18} />}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
