import { useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Construction } from 'lucide-react'
import { Link } from 'react-router-dom'

export function PlaceholderPage() {
  const { id, topic } = useParams()
  const location = useLocation()
  
  const getPageTitle = () => {
    const path = location.pathname
    
    if (path.includes('/briefings/')) return `Briefing: ${id}`
    if (path.includes('/analysis/') && topic) return `Analysis: ${topic}`
    if (path.includes('/historical/') && topic) return `Historical: ${topic}`
    if (path.includes('/analysis')) return 'Strategic Analysis'
    if (path.includes('/briefings')) return 'Briefings'
    if (path.includes('/feeds')) return 'Live Intelligence Feed'
    if (path.includes('/map')) return 'Situation Map'
    if (path.includes('/timeline')) return 'Conflict Timeline'
    if (path.includes('/sources')) return 'Source Tracker'
    if (path.includes('/predictions')) return 'Prediction Tracker'
    if (path.includes('/historical')) return 'Historical Roundtable'
    if (path.includes('/energy')) return 'Energy Brief'
    if (path.includes('/data')) return 'Data API'
    
    return 'Page'
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="w-16 h-16 mx-auto bg-[var(--elevated)] rounded-full flex items-center justify-center">
          <Construction className="w-8 h-8 text-[var(--accent)]" />
        </div>
        
        <div className="space-y-2">
          <h1 className="heading">
            {getPageTitle()}
          </h1>
          <p className="body-large text-[var(--text-muted)]">
            This page is under construction
          </p>
        </div>
        
        <p className="caption max-w-sm mx-auto">
          This section will be migrated from the existing HTML pages in future development runs. 
          For now, you can access the original HTML version.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-[var(--accent)] hover:text-[var(--accent-hover)] font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  )
}