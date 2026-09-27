export default function PageTitle({ title, children, className = '' }) {
  return (
    <div className={`flex items-center justify-between mb-[16px] flex-wrap gap-2 ${className}`}>
      <h1 className="text-[20px] leading-[28px] font-bold text-[#232734] m-0">{title}</h1>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  )
}