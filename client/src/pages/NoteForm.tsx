import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { notesApi, Note } from '../api/client';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function NoteForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [reporter, setReporter] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            // we don't have a getById in our notesApi yet! Let's just fetch all and filter, or add getById later.
            // But wait, we DID add readById to the NoteController! So we should wire it up in api client.
            // For now, let's keep it simple.
            const fetchNote = async () => {
                try {
                    const res = await notesApi.getAll();
                    const note = res.data.find(n => n.id === id);
                    if (note) {
                        setTitle(note.title);
                        setContent(note.content);
                        setTags(note.tags.join(', '));
                        setReporter(note.reporter);
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchNote();
        }
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);

        try {
            if (id) {
                await notesApi.update(id, { title, content, tags: tagsArray, reporter });
            } else {
                await notesApi.create({ title, content, tags: tagsArray, reporter });
            }
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred while saving the note');
        } finally {
            setLoading(false);
        }
    };

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
                    <label>Tags (comma separated)</label>
                    <input 
                        type="text" 
                        className="input" 
                        value={tags} 
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="React, Frontend, Ideas"
                    />
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
