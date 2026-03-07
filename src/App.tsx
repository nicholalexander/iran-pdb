import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { PlaceholderPage } from './pages/PlaceholderPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<HomePage />} />
          
          {/* Individual briefing pages */}
          <Route path="/briefings/:id" element={<PlaceholderPage />} />
          
          {/* Section pages */}
          <Route path="/briefings" element={<PlaceholderPage />} />
          <Route path="/feeds" element={<PlaceholderPage />} />
          <Route path="/map" element={<PlaceholderPage />} />
          <Route path="/timeline" element={<PlaceholderPage />} />
          <Route path="/sources" element={<PlaceholderPage />} />
          <Route path="/analysis" element={<PlaceholderPage />} />
          <Route path="/analysis/:topic" element={<PlaceholderPage />} />
          <Route path="/historical" element={<PlaceholderPage />} />
          <Route path="/historical/:topic" element={<PlaceholderPage />} />
          <Route path="/predictions" element={<PlaceholderPage />} />
          <Route path="/energy" element={<PlaceholderPage />} />
          <Route path="/data" element={<PlaceholderPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<PlaceholderPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App