import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/briefings', label: 'Briefings' },
  { href: '/feeds', label: 'Feed' },
  { href: '/map', label: 'Map' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/sources', label: 'Sources' },
  { href: '/analysis', label: 'Analysis' },
  { href: '/data', label: 'Data' },
]

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleNav = () => setIsOpen(!isOpen)
  const closeNav = () => setIsOpen(false)

  return (
    <nav className="sticky top-0 z-50 bg-[var(--surface)] border-b border-[var(--border)] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            onClick={closeNav}
          >
            <div className="w-8 h-8 bg-[var(--accent)] rounded-sm flex items-center justify-center">
              <span className="text-white font-bold text-sm mono">PDB</span>
            </div>
            <span className="font-medium text-lg">Iran Intelligence Briefings</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'mono text-sm font-medium uppercase tracking-wider px-3 py-2 rounded-md transition-colors duration-200',
                    location.pathname === link.href
                      ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--elevated)]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleNav}
              className="inline-flex items-center justify-center p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--elevated)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-[var(--border)]">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'mono text-sm font-medium uppercase tracking-wider block px-3 py-3 rounded-md transition-colors duration-200',
                    location.pathname === link.href
                      ? 'text-[var(--accent)] bg-[var(--accent)]/10'
                      : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--elevated)]'
                  )}
                  onClick={closeNav}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}