import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Calendar, Globe, Zap, BarChart3, Target, Clock, FileText, Database } from 'lucide-react'
import { cn } from '../lib/utils'
import briefingsData from '../data/briefings.json'

interface Briefing {
  id: string
  timestamp: string
  headline: string
  htmlUrl: string
  pdfUrl: string
  day: number
  type: string
}

const sectionCards = [
  {
    id: 'map',
    icon: Globe,
    title: '🗺️ Situation Map',
    description: '58 geolocated events · Timeline slider · Layer toggles',
    href: '/map',
    delay: 0.1
  },
  {
    id: 'timeline', 
    icon: Calendar,
    title: '📅 Conflict Timeline',
    description: '70 events · Category filters · Search',
    href: '/timeline',
    delay: 0.2
  },
  {
    id: 'feeds',
    icon: Zap,
    title: '📡 Live Feed',
    description: 'Multi-Source RSS Monitoring · 9 feeds · Auto-updating',
    href: '/feeds',
    delay: 0.3
  },
  {
    id: 'analysis',
    icon: BarChart3,
    title: '📊 Strategic Analysis',
    description: 'Multi-Domain Assessment (Feb 28 – Mar 5, 2026)',
    href: '/analysis',
    delay: 0.4
  },
  {
    id: 'sources',
    icon: FileText,
    title: '📰 Source Tracker',
    description: '58 Outlets Rated & Analyzed · 15+ countries',
    href: '/sources',
    delay: 0.5
  },
  {
    id: 'predictions',
    icon: Target,
    title: '🎯 Prediction Tracker',
    description: '46 predictions tracked · Accuracy scoring',
    href: '/predictions',
    delay: 0.6
  },
  {
    id: 'historical',
    icon: Clock,
    title: '📜 Historical Roundtable',
    description: '6 perspectives · Classical to modern',
    href: '/historical',
    delay: 0.7
  },
  {
    id: 'energy',
    icon: Zap,
    title: '⚡ Energy Brief',
    description: 'Oil · Shipping · Defense equities · Weekly',
    href: '/energy',
    delay: 0.8
  },
  {
    id: 'data',
    icon: Database,
    title: '💾 Data API',
    description: 'JSON & CSV feeds',
    href: '/data',
    delay: 0.9
  }
]

export function HomePage() {
  const [briefings, setBriefings] = useState<Briefing[]>([])
  const [showMoreBriefings, setShowMoreBriefings] = useState(false)

  useEffect(() => {
    // Sort briefings by timestamp (newest first)
    const sortedBriefings = [...briefingsData].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    setBriefings(sortedBriefings)

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    // Observe all reveal elements
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => observer.observe(el))

    return () => {
      revealElements.forEach((el) => observer.unobserve(el))
    }
  }, [])

  const latestBriefing = briefings[0]
  const displayedBriefings = showMoreBriefings ? briefings : briefings.slice(0, 8)

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative gradient-mesh py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h1 className="display animate-stagger-1">
              Iran Intelligence Briefings
            </h1>
            <p className="body-large text-[var(--text-muted)] max-w-2xl mx-auto animate-stagger-2">
              Automated Open-Source Intelligence Aggregation
            </p>
            
            {latestBriefing && (
              <div className="animate-stagger-3">
                <Link
                  to={`/briefings/${latestBriefing.id}`}
                  className="inline-flex items-center space-x-2 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white px-8 py-4 rounded-lg font-medium transition-colors duration-200"
                >
                  <span>Latest Briefing</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <p className="text-sm text-[var(--text-muted)] mt-3 mono">
                  {new Date(latestBriefing.timestamp).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Section Cards */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectionCards.map((card) => (
              <Link
                key={card.id}
                to={card.href}
                className={cn(
                  'group reveal bg-[var(--elevated)] border border-[var(--border)] rounded-lg p-6 hover:bg-[var(--surface)] hover:-translate-y-1 hover:shadow-lg hover:shadow-[var(--accent)]/10 transition-all duration-300',
                )}
                style={{ animationDelay: `${card.delay}s` }}
              >
                <div className="space-y-3">
                  <h3 className="subheading group-hover:text-[var(--accent)] transition-colors">
                    {card.title}
                  </h3>
                  <p className="caption">
                    {card.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Briefing Archive */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <h2 className="heading mb-8">Briefing Archive</h2>
            
            <div className="space-y-4">
              {displayedBriefings.map((briefing) => (
                <div
                  key={briefing.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[var(--elevated)] border border-[var(--border)] rounded-lg hover:bg-[var(--surface)] transition-colors duration-200"
                >
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="mono text-sm text-[var(--text-muted)]">
                        {new Date(briefing.timestamp).toLocaleDateString()} • 
                        {new Date(briefing.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • 
                        Day {briefing.day}
                      </span>
                      <span className={cn(
                        'mono text-xs px-2 py-1 rounded',
                        briefing.type === 'morning' 
                          ? 'bg-[var(--reported)]/20 text-[var(--reported)]' 
                          : 'bg-[var(--accent)]/20 text-[var(--accent)]'
                      )}>
                        {briefing.type.toUpperCase()}
                      </span>
                    </div>
                    <p className="body text-[var(--text)] line-clamp-2">
                      {briefing.headline}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-3 mt-3 md:mt-0">
                    <Link
                      to={briefing.htmlUrl.replace('../', '/')}
                      className="inline-flex items-center space-x-1 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      <span>HTML</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    <Link
                      to={briefing.pdfUrl.replace('../', '/')}
                      className="inline-flex items-center space-x-1 text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors"
                    >
                      <span>PDF</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {briefings.length > 8 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowMoreBriefings(!showMoreBriefings)}
                  className="inline-flex items-center space-x-2 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
                >
                  <span>
                    {showMoreBriefings ? 'Show Less' : `Show All ${briefings.length} Briefings`}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section className="px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="reveal">
            <h2 className="heading mb-8">Special Reports</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[var(--elevated)] border border-[var(--border)] rounded-lg p-6 hover:bg-[var(--surface)] transition-colors">
                <h3 className="subheading mb-3">Strategic Assessment</h3>
                <p className="caption mb-4">
                  The US-Iran War: A Multi-Domain Assessment covering military strategy, 
                  geopolitical implications, economic impact, and humanitarian assessment.
                </p>
                <Link
                  to="/analysis/iran-strategic-report.pdf"
                  className="inline-flex items-center space-x-2 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
                >
                  <span>Strategic Report PDF</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="bg-[var(--elevated)] border border-[var(--border)] rounded-lg p-6 hover:bg-[var(--surface)] transition-colors">
                <h3 className="subheading mb-3">Historical Roundtable</h3>
                <p className="caption mb-4">
                  Perspectives from six historical figures on the current conflict, 
                  spanning classical to modern strategic thinking.
                </p>
                <Link
                  to="/historical/iran-historical-roundtable.pdf"
                  className="inline-flex items-center space-x-2 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
                >
                  <span>Historical Analysis PDF</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}