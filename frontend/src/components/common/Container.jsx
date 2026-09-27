export default function Container({ children, className = '' }) {
  return (
    <div className={`container mx-auto max-w-[1280px] px-4 ${className}`}>
      {children}
    </div>
  )
}
