import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { BookOpen, PlusCircle } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import NoteForm from './pages/NoteForm';

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <nav className="navbar glass-panel">
          <div className="nav-brand">
            <BookOpen size={28} className="text-accent" />
            <span className="brand-name">NotesPro</span>
          </div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Dashboard</Link>
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
