function Chevron({ dir = 'left' }) {
  return (
    <svg width="6" height="10" viewBox="0 0 6 10" className={dir === 'right' ? 'rotate-180' : ''} fill="none">
      <path d="M5 1L1 5L5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Pagination({ current = 1, total = 1, onChange }) {
  if (total <= 1) return null

  
  const pages = []
  const window = 1 // pages around current
  const showFirst = current > 3
  const showLast  = current < total - 2

  if (total <= 9) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (showFirst) pages.push('...')
    const start = Math.max(2, current - window)
    const end   = Math.min(total - 1, current + window)
    for (let i = start; i <= end; i++) pages.push(i)
    if (showLast) pages.push('...')
    if (total > 1) pages.push(total)
  }

  
  let pagesArr = pages
  if (total <= 14) {
    pagesArr = []
    for (let i = 1; i <= total; i++) pagesArr.push(i)
  }

  const handleClick = (p) => { if (typeof p === 'number' && p !== current) onChange?.(p) }

  return (
    <nav className="py-[16px] flex justify-center">
      <ul className="flex items-center gap-[6px] list-none p-0 m-0">
        <li>
          <button type="button"
            disabled={current === 1}
            onClick={() => handleClick(current - 1)}
            className={`w-[28px] h-[28px] flex items-center justify-center rounded-full text-[13px] ${current === 1 ? 'text-[#9da3ae] cursor-not-allowed' : 'text-[#232734] hover:bg-[#f1fafd] hover:text-[#009ef7]'}`}
          >
            <Chevron dir="left" />
          </button>
        </li>
        {pagesArr.map((p, i) => (
          <li key={`${p}-${i}`}>
            {p === '...' ? (
              <span className="w-[28px] h-[28px] flex items-center justify-center text-[#9da3ae] text-[13px]">…</span>
            ) : (
              <button type="button" onClick={() => handleClick(p)}
                className={`w-[28px] h-[28px] flex items-center justify-center rounded-full text-[13px] font-medium transition-colors ${
                  p === current
                    ? 'bg-[#009ef7] text-white'
                    : 'text-[#232734] hover:bg-[#f1fafd] hover:text-[#009ef7]'
                }`}
              >
                {p}
              </button>
            )}
          </li>
        ))}
        <li>
          <button type="button"
            disabled={current === total}
            onClick={() => handleClick(current + 1)}
            className={`w-[28px] h-[28px] flex items-center justify-center rounded-full text-[13px] ${current === total ? 'text-[#9da3ae] cursor-not-allowed' : 'text-[#232734] hover:bg-[#f1fafd] hover:text-[#009ef7]'}`}
          >
            <Chevron dir="right" />
          </button>
        </li>
      </ul>
    </nav>
  )
}