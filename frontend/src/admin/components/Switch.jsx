export default function Switch({ checked, onChange, color = 'blue', disabled = false }) {
  const onColor = color === 'success' ? 'bg-[#19c553]' : 'bg-[#009ef7]'
  const offColor = 'bg-[#e5e7eb]'

  return (
    <label className={`relative inline-block w-[40px] h-[22px] ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        className="sr-only peer"
        checked={!!checked}
        onChange={(e) => onChange?.(e.target.checked)}
        disabled={disabled}
      />
      <span
        className={`absolute inset-0 rounded-full transition-colors duration-200 ${checked ? onColor : offColor}`}
      />
      <span
        className={`absolute top-[2px] left-[2px] w-[18px] h-[18px] rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-200 ${checked ? 'translate-x-[18px]' : 'translate-x-0'}`}
      />
    </label>
  )
}