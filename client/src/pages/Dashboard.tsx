import React, { useEffect, useState } from 'react';
import { Note, notesApi } from '../api/client';
import { NoteCard } from '../components/NoteCard';
import { Search, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [tagFilter, setTagFilter] = useState('');

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await notesApi.getAll({ tag: tagFilter || undefined, limit: 50, page: 1 });
            setNotes(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchNotes();
        }, 300);
        return () => clearTimeout(delayDebounceFn);
    }, [tagFilter]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await notesApi.delete(id);
            setNotes(notes.filter(n => n.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete note');
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Your Notes</h1>
                    <p>Manage and organize your thoughts beautifully.</p>
                </div>
                
                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input 
                        type="text" 
                        className="input search-input" 
                        placeholder="Search by tag (e.g. tech, personal)..." 
                        value={tagFilter}
                        onChange={(e) => setTagFilter(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loader-container">
                    <Loader2 className="spinner" size={32} />
                    <p>Loading your notes...</p>
                </div>
            ) : notes.length === 0 ? (
                <div className="empty-state glass-panel">
                    <h2>No notes found</h2>
                    <p>Looks like it's a bit empty here. Time to gather your thoughts!</p>
                </div>
            ) : (
                <div className="notes-grid">
                    {notes.map(note => (
                        <NoteCard key={note.id} note={note} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
