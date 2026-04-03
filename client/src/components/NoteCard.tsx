import React from 'react';
import { Note } from '../api/client';
import { Calendar, Tag as TagIcon, Edit2, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface NoteCardProps {
    note: Note;
    onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
    return (
        <div className="note-card glass-panel">
            <div className="note-header">
                <h3>{note.title}</h3>
                <div className="note-actions">
                    <Link to={`/edit/${note.id}`} className="action-btn text-accent">
                        <Edit2 size={16} />
                    </Link>
                    <button onClick={() => onDelete(note.id)} className="action-btn text-danger">
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            
            <p className="note-content">{note.content}</p>
            
            <div className="note-footer">
                <div className="tags">
                    {note.tags.map((tag, idx) => (
                        <span key={idx} className="tag">
                            <TagIcon size={12} /> {tag}
                        </span>
                    ))}
                </div>
                <div className="meta">
                    <span className="date">
                        <Calendar size={14} /> 
                        {format(new Date(note.createdAt), 'MMM dd, yyyy')}
                    </span>
                    <span className="reporter">{note.reporter}</span>
                </div>
            </div>
        </div>
    );
};
