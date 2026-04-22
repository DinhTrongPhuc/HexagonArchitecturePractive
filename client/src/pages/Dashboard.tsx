import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Note, notesApi, aiApi } from '../api/client';
import { NoteCard } from '../components/NoteCard';
import { CustomSelect } from '../components/CustomSelect';
import {
    Search,
    Loader2,
    Filter,
    Calendar as CalendarIcon,
    X,
    ArrowUpDown,
    RotateCcw,
    ChevronDown,
    LayoutGrid,
    ArrowUp,
    Sparkles,
    Bot,
} from 'lucide-react';

type SortOption = 'newest_update' | 'oldest_update' | 'newest_created' | 'oldest_created';

export default function Dashboard() {
    const [allNotes, setAllNotes] = useState<Note[]>([]);
    const [loading, setLoading] = useState(true);
    const [titleQuery, setTitleQuery] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('newest_update');
    const [showAllNotes, setShowAllNotes] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);

    // AI States
    const [isAskingAI, setIsAskingAI] = useState(false);
    const [aiAnswer, setAiAnswer] = useState<string | null>(null);
    const [showAIResponse, setShowAIResponse] = useState(false);

    const startInputRef = useRef<HTMLInputElement>(null);
    const endInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowTopBtn(true);
            } else {
                setShowTopBtn(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

    const visibleNotes = showAllNotes ? filteredAndSortedNotes : filteredAndSortedNotes.slice(0, 3);
    const isFiltered = titleQuery || tagFilter || startDate || endDate || sortBy !== 'newest_update';

    const clearDateFilter = () => {
        setStartDate('');
        setEndDate('');
    };

    const clearAllFilters = () => {
        setTitleQuery('');
        setTagFilter('');
        setStartDate('');
        setEndDate('');
        setSortBy('newest_update');
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

    const handleAskAI = async (e?: React.MouseEvent) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        if (!titleQuery.trim() || isAskingAI) return;

        setShowAIResponse(true);
        setIsAskingAI(true);
        setAiAnswer(null);

        try {
            const res = await aiApi.ask(titleQuery);
            setAiAnswer(res.answer);
        } catch (error: any) {
            console.error("AI Error:", error);
            setAiAnswer(`Error: Unable to connect to AI Agent. ${error.message || ""}`);
        } finally {
            setIsAskingAI(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className="dashboard">
            <section className="dashboard-hero glass-panel">
                <div className="dashboard-hero-inner">
                    <div className="ticket-chip ticket-chip-accent">
                        <Bot size={14} />
                        <span>AI - Solution Agent</span>
                    </div>
                    <h1>Smart Solution Finder</h1>
                    <p>
                        Search your notes or ask <strong>Gemini AI</strong> for solution guidance.
                    </p>

                    <div className="dashboard-hero-search glass-panel" style={{ padding: '8px', zIndex: 10 }}>
                        <div className="search-bar dashboard-title-search" style={{ width: '100%', maxWidth: '750px', height: '60px', borderRadius: '30px', margin: '0 auto', display: 'flex', alignItems: 'center', background: 'var(--input-bg)', border: '1px solid var(--border)' }}>
                            <input
                                type="text"
                                className="input search-input dashboard-title-input"
                                placeholder="Describe the issue... (e.g., Lead allocation v2?)"
                                value={titleQuery}
                                onChange={(e) => setTitleQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                                style={{ fontSize: '1.1rem', paddingLeft: '24px', flex: 1, height: '100%', background: 'transparent', border: 'none', color: 'var(--text-primary)' }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleAskAI}
                                disabled={isAskingAI || !titleQuery.trim()}
                                style={{
                                    height: '44px',
                                    borderRadius: '22px',
                                    marginRight: '8px',
                                    padding: '0 20px',
                                    gap: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: '600',
                                    boxShadow: '0 4px 15px rgba(var(--accent-rgb), 0.3)'
                                }}
                            >
                                {isAskingAI ? <Loader2 className="spinner" size={18} /> : <Sparkles size={18} />}
                                {isAskingAI ? 'Thinking...' : 'Ask AI'}
                            </button>
                        </div>
                    </div>

                    {!showAIResponse && (
                        <div className="dashboard-scroll-hint">
                            <ChevronDown size={16} />
                            <span>Scroll down for notes</span>
                        </div>
                    )}
                </div>
            </section>

            {showAIResponse && (
                <section className="dashboard-ai-section" style={{ padding: '0 2rem', marginBottom: '2rem', animation: 'fadeInUp 0.5s ease' }}>
                    <div className="ai-response-area glass-panel shadow-lg" style={{ width: '100%', maxWidth: '1100px', margin: '0 auto', textAlign: 'left', padding: '1.5rem', border: '2px solid var(--accent-hover)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.8rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--accent-hover)', fontWeight: '700', fontSize: '1.1rem' }}>
                                <Bot size={24} />
                                <span>AI Assistant Guidance</span>
                            </div>
                            <button className="action-btn" onClick={() => setShowAIResponse(false)} style={{ background: 'rgba(255,255,255,0.05)' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {isAskingAI ? (
                            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <Loader2 className="spinner" size={48} style={{ margin: '0 auto 1.5rem', color: 'var(--accent-hover)' }} />
                                <p style={{ fontSize: '1.1rem' }}>Analyzing your knowledge base to provide expert guidance...</p>
                            </div>
                        ) : (
                            <div className="ai-answer-content" style={{ padding: '0.5rem', lineHeight: '1.8', fontSize: '1rem', color: 'var(--text-primary)', whiteSpace: 'pre-line' }}>
                                {aiAnswer}
                            </div>
                        )}

                        {!isAskingAI && (
                            <div style={{ marginTop: '2rem', paddingTop: '1.2rem', borderTop: '1px solid var(--border)', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.7 }}>
                                <Sparkles size={14} />
                                <span>This insight is generated specifically from your notes and ticket history.</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="dashboard-notes-section">
                <div className="dashboard-notes-head">
                    <div>
                        <h2>{showAllNotes ? 'All Notes' : 'Notes Preview'}</h2>
                        <p>
                            {showAllNotes
                                ? 'All filters and all matching notes are visible now.'
                                : 'Only a few note cards are shown at first.'}
                        </p>
                    </div>

                    <button className="btn btn-ghost" onClick={() => setShowAllNotes(prev => !prev)}>
                        {showAllNotes ? 'Collapse Notes' : 'View All Notes'}
                    </button>
                </div>

                {showAllNotes && (
                    <div className="glass-panel dashboard-filters-panel">
                        <div className="dashboard-filters-top">
                            <CustomSelect
                                value={sortBy}
                                onChange={(val) => setSortBy(val as SortOption)}
                                icon={<ArrowUpDown size={16} />}
                                width="190px"
                                options={[
                                    { value: 'newest_update', label: 'Recently Updated' },
                                    { value: 'oldest_update', label: 'Oldest Updated' },
                                    { value: 'newest_created', label: 'Newest Created' },
                                    { value: 'oldest_created', label: 'Oldest Created' },
                                ]}
                            />

                            <CustomSelect
                                value={tagFilter}
                                onChange={(val) => setTagFilter(val)}
                                icon={<Filter size={16} />}
                                width="160px"
                                options={[
                                    { value: '', label: 'All Tags' },
                                    ...availableTags.map(tag => ({ value: tag, label: tag })),
                                ]}
                            />
                        </div>

                        <div className="dashboard-filters-bottom">
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
                                <span className={`date-placeholder ${endDate ? 'has-value' : ''}`}>
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

                            {isFiltered && (
                                <button
                                    className="btn btn-ghost"
                                    onClick={clearAllFilters}
                                    style={{ height: '44px', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                                >
                                    <RotateCcw size={16} /> Clear Filters
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="loader-container">
                        <Loader2 className="spinner" size={32} />
                        <p>Loading your notes...</p>
                    </div>
                ) : filteredAndSortedNotes.length === 0 ? (
                    <div className="empty-state glass-panel">
                        <h2>No notes fit your search</h2>
                    </div>
                ) : (
                    <div className="notes-grid">
                        {visibleNotes.map(note => (
                            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
                        ))}
                    </div>
                )}

                {!loading && !showAllNotes && filteredAndSortedNotes.length > 3 && (
                    <div className="dashboard-preview-actions">
                        <button className="btn btn-primary" onClick={() => setShowAllNotes(true)}>
                            View All {filteredAndSortedNotes.length} Notes
                        </button>
                    </div>
                )}
            </section>

            {showTopBtn && (
                <button
                    className="scroll-to-top-btn"
                    onClick={scrollToTop}
                    style={{ zIndex: 100 }}
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </div>
    );
}
