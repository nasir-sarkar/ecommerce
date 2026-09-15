// White rounded bordered card wrapper - matches Dashboard cards exactly
export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`bg-white rounded-[8px] border border-[#f1f1f4] shadow-[0px_6px_14px_rgba(35,39,52,0.04)] ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

// Card header sub-component
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`px-[25px] py-[16px] border-b border-[#f1f1f4] ${className}`}>
      {children}
    </div>
  )
}

// Card body sub-component
export function CardBody({ children, className = '' }) {
  return <div className={`px-[25px] py-[16px] ${className}`}>{children}</div>
}