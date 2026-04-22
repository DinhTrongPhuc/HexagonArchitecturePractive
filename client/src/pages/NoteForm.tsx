import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notesApi, Note } from '../api/client';
import { ArrowLeft, Save, Loader2, X, Plus, Tag as TagIcon } from 'lucide-react';

export default function NoteForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [reporter, setReporter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Tag management states
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // Fetch all unique tags from DB
                const tags = await notesApi.getTags();
                setAvailableTags(tags);

                if (id) {
                    const res = await notesApi.getAll();
                    const note = res.data.find(n => n.id === id);
                    if (note) {
                        setTitle(note.title);
                        setContent(note.content);
                        setSelectedTags(note.tags);
                        setReporter(note.reporter);
                    }
                }
            } catch (err) {
                console.error('Error fetching tags:', err);
            }
        };
        loadInitialData();
    }, [id]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleAddTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !selectedTags.includes(trimmedTag) && selectedTags.length < 3) {
            setSelectedTags([...selectedTags, trimmedTag]);
            setTagInput('');
            setShowDropdown(false);
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (tagInput) handleAddTag(tagInput);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload = { title, content, tags: selectedTags, reporter };
            if (id) {
                await notesApi.update(id, payload);
            } else {
                await notesApi.create(payload);
            }
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred while saving the note');
        } finally {
            setLoading(false);
        }
    };

    const filteredTags = availableTags.filter(
        tag => tag.toLowerCase().includes(tagInput.toLowerCase()) && !selectedTags.includes(tag)
    );

    return (
        <div className="note-form-container glass-panel">
            <div className="form-header">
                <button onClick={() => navigate(-1)} className="btn btn-ghost">
                    <ArrowLeft size={18} /> Back
                </button>
                <h2>{id ? 'Edit Note' : 'Create New Note'}</h2>
            </div>

            {error && <div className="alert-error">{error}</div>}

            <form onSubmit={handleSubmit} className="note-form">
                <div className="form-group">
                    <label>Reporter Email</label>
                    <input 
                        type="email" 
                        className="input" 
                        value={reporter} 
                        onChange={(e) => setReporter(e.target.value)}
                        placeholder="your@email.com"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Title</label>
                    <input 
                        type="text" 
                        className="input" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Give your note a catchy title..."
                        required 
                        minLength={3}
                    />
                </div>

                <div className="form-group">
                    <label>Tags (Max 3)</label>
                    <div className="tag-input-wrapper">
                        <div className="selected-tags">
                            {selectedTags.map(tag => (
                                <span key={tag} className="tag-chip">
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                            {selectedTags.length < 3 && (
                                <div className="tag-input-container" ref={dropdownRef}>
                                    <input 
                                        type="text" 
                                        className="tag-bare-input"
                                        value={tagInput}
                                        onChange={(e) => {
                                            setTagInput(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        onFocus={() => setShowDropdown(true)}
                                        onKeyDown={handleKeyDown}
                                        placeholder={selectedTags.length === 0 ? "Add tags..." : ""}
                                    />
                                    {showDropdown && (tagInput || filteredTags.length > 0) && (
                                        <div className="tag-dropdown">
                                            {filteredTags.map(tag => (
                                                <div 
                                                    key={tag} 
                                                    className="tag-option"
                                                    onClick={() => handleAddTag(tag)}
                                                >
                                                    <TagIcon size={14} /> {tag}
                                                </div>
                                            ))}
                                            {tagInput && !availableTags.includes(tagInput) && (
                                                <div 
                                                    className="tag-option create-tag"
                                                    onClick={() => handleAddTag(tagInput)}
                                                >
                                                    <Plus size={14} /> Create "{tagInput}"
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <small className="form-help">Type and press Enter to add a new tag or select from the list.</small>
                </div>

                <div className="form-group">
                    <label>Content</label>
                    <textarea 
                        className="textarea" 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)}
                        rows={8}
                        placeholder="Write down your thoughts..."
                        required
                        minLength={10}
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? <Loader2 className="spinner" size={18} /> : <Save size={18} />}
                        {id ? 'Update Note' : 'Save Note'}
                    </button>
                </div>
            </form>
        </div>
    );
}
