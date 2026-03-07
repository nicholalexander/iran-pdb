import { ReactNode } from 'react'
import { Nav } from './Nav'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Classification Banner */}
      <div className="bg-[var(--surface)] border-b border-[var(--accent)] py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <span className="classification-banner">
              UNCLASSIFIED // OPEN SOURCE // AI-GENERATED
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <Nav />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--surface)] mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="font-semibold text-lg mb-3">About This System</h3>
              <p className="text-[var(--text-muted)] leading-relaxed">
                This intelligence briefing platform is an AI-powered system that aggregates and analyzes 
                open-source information from multiple international outlets. All content is automatically 
                generated and should be verified against primary sources.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-3">Disclaimer</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                This system processes publicly available information and generates analytical content 
                using artificial intelligence. The assessments, predictions, and analysis presented 
                here are not official intelligence products and should not be used for operational 
                decision-making. All claims require independent verification.
              </p>
            </div>
          </div>
          
          <div className="border-t border-[var(--border)] mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm text-[var(--text-muted)]">
              <p>© 2026 Iran Intelligence Briefings • Open Source Intelligence Platform</p>
              <p className="mt-2 md:mt-0 mono">
                Last Updated: {new Date().toISOString().split('T')[0]} • 
                <span className="text-[var(--accent)]"> AUTOMATED SYSTEM</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}