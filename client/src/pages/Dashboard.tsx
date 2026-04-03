import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Note, notesApi } from '../api/client';
import { NoteCard } from '../components/NoteCard';
import { Search, Loader2, Filter, Calendar as CalendarIcon, X, ArrowUpDown } from 'lucide-react';

type SortOption = 'newest_update' | 'oldest_update' | 'newest_created' | 'oldest_created';

export default function Dashboard() {
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [titleQuery, setTitleQuery] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest_update');
    
    const startInputRef = useRef<HTMLInputElement>(null);
    const endInputRef = useRef<HTMLInputElement>(null);

    const fetchNotes = async () => {
        setLoading(true);
        try {
            const res = await notesApi.getAll({ limit: 1000, page: 1 });
            setAllNotes(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const availableTags = useMemo(() => {
        const tags = new Set<string>();
        allNotes.forEach(note => {
            note.tags.forEach(tag => tags.add(tag));
        });
        return Array.from(tags).sort();
    }, [allNotes]);

    const filteredAndSortedNotes = useMemo(() => {
        const q = titleQuery.trim().toLowerCase();
        
        // 1. Filtering
        const filtered = allNotes.filter(note => {
            const noteDate = new Date(note.createdAt).setHours(0, 0, 0, 0);
            
            const matchTitle = !q || note.title.toLowerCase().includes(q);
            const matchTag = !tagFilter || note.tags.includes(tagFilter);
            
            let matchDate = true;
            if (startDate) {
                const s = new Date(startDate).setHours(0, 0, 0, 0);
                if (noteDate < s) matchDate = false;
            }
            if (endDate) {
                const e = new Date(endDate).setHours(0, 0, 0, 0);
                if (noteDate > e) matchDate = false;
            }

            return matchTitle && matchTag && matchDate;
        });

        // 2. Sorting
        return filtered.sort((a, b) => {
            const dateA = (d: string) => new Date(d).getTime();
            switch (sortBy) {
                case 'newest_update':
                    return dateA(b.updateAt) - dateA(a.updateAt);
                case 'oldest_update':
                    return dateA(a.updateAt) - dateA(b.updateAt);
                case 'newest_created':
                    return dateA(b.createdAt) - dateA(a.createdAt);
                case 'oldest_created':
                    return dateA(a.createdAt) - dateA(b.createdAt);
                default:
                    return 0;
            }
        });
    }, [allNotes, titleQuery, tagFilter, startDate, endDate, sortBy]);

    const clearDateFilter = () => {
        setStartDate('');
        setEndDate('');
    };

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
            <div className="dashboard-header" style={{ alignItems: 'flex-start' }}>
                <div>
                    <h1>Ticket Notes Case</h1>
                    <p>Manage and organize your ticket notes for learning and working with Ticket.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'flex-end' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {/* Sort Dropdown */}
                        <div className="search-bar" style={{ width: '180px' }}>
                            <ArrowUpDown className="search-icon" size={16} />
                            <select 
                                className="input search-input" 
                                style={{ appearance: 'none', cursor: 'pointer', fontSize: '0.85rem', paddingLeft: '35px' }}
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value as SortOption)}
                            >
                                <option value="newest_update">Recently Updated</option>
                                <option value="oldest_update">Oldest Updated</option>
                                <option value="newest_created">Newest Created</option>
                                <option value="oldest_created">Oldest Created</option>
                            </select>
                        </div>

                        {/* Search by Title */}
                        <div className="search-bar" style={{ width: '200px' }}>
                            <Search className="search-icon" size={16} />
                            <input
                                type="text"
                                className="input search-input"
                                placeholder="Find by title..."
                                value={titleQuery}
                                onChange={(e) => setTitleQuery(e.target.value)}
                            />
                        </div>

                        {/* Filter by Tag Dropdown */}
                        <div className="search-bar" style={{ width: '140px' }}>
                            <Filter className="search-icon" size={16} />
                            <select 
                                className="input search-input" 
                                style={{ appearance: 'none', cursor: 'pointer', fontSize: '0.85rem', paddingLeft: '35px' }}
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                            >
                                <option value="">All Tags</option>
                                {availableTags.map(tag => (
                                    <option key={tag} value={tag}>{tag}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Date Filters */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <div className="search-bar date-search-bar" style={{ width: '155px' }} onClick={() => startInputRef.current?.showPicker()}>
                            <CalendarIcon className="search-icon" size={16} />
                            <span className={`date-placeholder ${startDate ? 'has-value' : ''}`}>
                                {startDate ? startDate : 'From Date'}
                            </span>
                            <input 
                                ref={startInputRef}
                                type="date" 
                                className="input date-input-hidden" 
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                        </div>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>to</span>
                        <div className="search-bar date-search-bar" style={{ width: '155px' }} onClick={() => endInputRef.current?.showPicker()}>
                            <CalendarIcon className="search-icon" size={16} />
                            <span className={`date-placeholder ${startDate ? 'has-value' : ''}`}>
                                {endDate ? endDate : 'To Date'}
                            </span>
                            <input 
                                ref={endInputRef}
                                type="date" 
                                className="input date-input-hidden" 
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                        {(startDate || endDate) && (
                            <button 
                                className="action-btn text-danger" 
                                onClick={(e) => { e.stopPropagation(); clearDateFilter(); }}
                                title="Clear date filter"
                                style={{ background: 'rgba(239, 68, 68, 0.1)', borderRadius: '50%' }}
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="loader-container">
                    <Loader2 className="spinner" size={32} />
                    <p>Loading your notes...</p>
                </div>
            ) : filteredAndSortedNotes.length === 0 ? (
                <div className="empty-state glass-panel">
                    <h2>No notes fit your search</h2>
                    <p>Try clearing your filters or changing your search criteria.</p>
                </div>
            ) : (
                <div className="notes-grid">
                    {filteredAndSortedNotes.map(note => (
                        <NoteCard key={note.id} note={note} onDelete={handleDelete} />
                    ))}
                </div>
            )}
        </div>
    );
}
