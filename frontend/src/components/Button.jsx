export default function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 rounded bg-primary text-background hover:bg-secondary transition ${className}`}
    >
      {children}
    </button>
  )
}
