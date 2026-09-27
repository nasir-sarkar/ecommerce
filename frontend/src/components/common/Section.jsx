export default function Section({
  children,
  className = '',
  bg = '',
  py = 'py-5',
}) {
  return (
    <section className={`${py} ${bg} ${className}`}>
      {children}
    </section>
  )
}
