import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ProjectPage from './pages/ProjectPage'

function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col items-center">

      {/* Mailbox bar */}
      <div
        className="flex items-center justify-center shrink-0"
        style={{
          width: '1920px',
          maxWidth: '100vw',
          height: '30px',
          backgroundColor: 'var(--secondary)',
          color: 'var(--foreground)',
          fontSize: '13px',
          letterSpacing: '1px',
        }}
      >
        yyting20248@163.com
      </div>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="*" element={
          <div style={{minHeight:'100vh',background:'#F5F5F5',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <p style={{fontSize:'20px',color:'#333'}}>
            404 — Path: {typeof window !== 'undefined' ? window.location.pathname : 'N/A'}
          </p>
          </div>
        } />
      </Routes>
    </div>
  )
}

export default App
