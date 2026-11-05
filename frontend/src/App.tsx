import React from 'react'
import './App.css'

export const App: React.FC = () => {
  return (
    <div className="app-container">
      <header>
        <h1>VerityAI</h1>
        <p className="tagline">Hallucination-Aware Information Assistant</p>
      </header>
      <main>
        <div className="status-card">
          <span className="status-indicator">●</span>
          <span>System Status: Initializing (Phase 0)</span>
        </div>
      </main>
    </div>
  )
}

export default App
