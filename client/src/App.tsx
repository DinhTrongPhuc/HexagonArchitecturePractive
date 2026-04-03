import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, PlusCircle, Layers, Sun, Moon } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import NoteForm from './pages/NoteForm';

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <BrowserRouter>
      <div className="layout">
        <nav className="navbar glass-panel">
          <div className="nav-brand">
            <BookOpen size={28} className="text-accent" />
            <span className="brand-name">NotesPro</span>
          </div>
          <div className="nav-links">
            <button onClick={toggleTheme} className="btn btn-ghost" style={{ padding: '8px' }} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link to="/" className="nav-link">Dashboard</Link>
            <Link to="/allocation" className="btn btn-primary">
              <Layers size={18} /> Allocation
            </Link>
            <Link to="/new" className="btn btn-primary">
              <PlusCircle size={18} /> New Note
            </Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new" element={<NoteForm />} />
            <Route path="/edit/:id" element={<NoteForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
