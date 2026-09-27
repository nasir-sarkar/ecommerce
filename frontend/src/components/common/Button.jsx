export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
}) {
  const base = 'inline-flex items-center justify-center font-medium rounded transition-colors focus:outline-none'

  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600 disabled:opacity-50',
    outline: 'border border-gray-300 text-gray-700 hover:border-primary hover:text-primary',
    ghost: 'text-gray-600 hover:text-primary hover:bg-gray-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  }

  const sizes = {
    sm: 'text-[12px] px-3 py-1.5',
    md: 'text-[13px] px-4 py-2',
    lg: 'text-[15px] px-6 py-2.5',
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
