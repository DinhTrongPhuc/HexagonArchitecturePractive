import React, { useEffect, useState, useMemo } from 'react';
import { Note, notesApi } from '../api/client';
import { NoteCard } from '../components/NoteCard';
import { Search, Loader2 } from 'lucide-react';

export default function Dashboard() {
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchNotes = async () => {
        setLoading(true);
        try {
            // Luôn fetch tất cả notes, filtering & sorting sẽ do Frontend xử lý
            const res = await notesApi.getAll({ limit: 1000, page: 1 });

            // Sắp xếp mới nhất lên đầu
            const sorted = [...res.data].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setAllNotes(sorted);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // Lọc theo title hoặc tag, không phân biệt hoa/thường
    const filteredNotes = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return allNotes;

        return allNotes.filter(note => {
            const matchTitle = note.title.toLowerCase().includes(q);
            const matchTag = note.tags.some(tag => tag.toLowerCase().includes(q));
            return matchTitle || matchTag;
        });
    }, [allNotes, searchQuery]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this note?')) return;
        try {
            await notesApi.delete(id);
            setAllNotes(prev => prev.filter(n => n.id !== id));
        } catch (error) {
            console.error(error);
            alert('Failed to delete note');
        }
    };

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div>
                    <h1>Ticket Notes Case</h1>
                    <p>Manage and organize your ticket notes for learning and working with Ticket.</p>
                </div>

                <div className="search-bar">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        className="input search-input"
                        placeholder="Search by title or tag..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loader-container">
                    <Loader2 className="spinner" size={32} />
                    <p>Loading your notes...</p>
                </div>
            ) : filteredNotes.length === 0 ? (
                <div className="empty-state glass-panel">
                    <h2>{searchQuery ? `No results for "${searchQuery}"` : 'No notes found'}</h2>
                    <p>{searchQuery ? 'Try a different title or tag.' : "Looks like it's a bit empty here. Time to gather your thoughts!"}</p>
                </div>
            ) : (
                <div className="notes-grid">
                    {filteredNotes.map(note => (
                        <NoteCard key={note.id} note={note} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
