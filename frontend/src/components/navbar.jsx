import Button from './Button'

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-background shadow-md">
      <h1 className="text-primary font-bold text-xl">Setu</h1>
      <div className="space-x-4">
        <Button>Login</Button>
        <Button>Signup</Button>
      </div>
    </nav>
  )
}
