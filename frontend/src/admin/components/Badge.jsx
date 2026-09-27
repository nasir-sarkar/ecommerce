const VARIANTS = {
  danger:    'bg-[#f1416c] text-white',
  success:   'bg-[#19c553] text-white',
  info:      'bg-[#8f60ee] text-white',
  warning:   'bg-[#ffc700] text-[#232734]',
  primary:   'bg-[#009ef7] text-white',
  secondary: 'bg-[#a1a5b3] text-white',
  dark:      'bg-[#232734] text-white',
  // soft variants
  'soft-danger':  'bg-[#fff4f8] text-[#f1416c]',
  'soft-success': 'bg-[#e6fff3] text-[#19c553]',
  'soft-info':    'bg-[#f4effe] text-[#8f60ee]',
  'soft-warning': 'bg-[#fff9e3] text-[#b08800]',
  'soft-primary': 'bg-[#f1fafd] text-[#009ef7]',
}

export default function Badge({ children, variant = 'danger', className = '' }) {
  const cls = VARIANTS[variant] || VARIANTS.danger
  return (
    <span className={`inline-flex items-center px-[6px] py-[2px] rounded-[3px] text-[10px] leading-[14px] font-semibold ${cls} ${className}`}>
      {children}
    </span>
  )
}