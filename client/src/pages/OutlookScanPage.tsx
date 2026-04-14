import React, { useEffect, useState } from 'react';
import { supportTicketsApi, type ScannedSupportTicket, type ScanSupportTicketsResponse } from '../api/client';
import { MailSearch, Loader2, Search, RefreshCw, Link as LinkIcon, ExternalLink, Inbox, User, Calendar, Hash } from 'lucide-react';

const DEFAULT_SEARCH_PHRASE = 'xem phiếu hỗ trợ';

function formatDateTime(value?: string) {
    if (!value) {
        return 'Unknown time';
    }

    return new Intl.DateTimeFormat('vi-VN', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(new Date(value));
}

function TicketCard({ ticket }: { ticket: ScannedSupportTicket }) {
    return (
        <article className="glass-panel ticket-card">
            <div className="ticket-card-header">
                <div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <div className="ticket-chip" title={ticket.id}>
                            <Hash size={14} />
                            <span>...{ticket.id.slice(-12)}</span>
                        </div>
                        <div className="ticket-chip ticket-chip-accent">
                            <span>{ticket.isRead === false ? 'Unread' : 'Read status unavailable'}</span>
                        </div>
                    </div>
                    <h3>{ticket.subject}</h3>
                </div>

                {ticket.webLink && (
                    <a
                        className="btn btn-ghost ticket-open-btn"
                        href={ticket.webLink}
                        target="_blank"
                        rel="noreferrer"
                    >
                        <ExternalLink size={16} />
                        Open Outlook
                    </a>
                )}
            </div>

            <div className="ticket-meta-grid">
                <div className="ticket-meta-item">
                    <User size={14} />
                    <span>{ticket.senderName || ticket.senderAddress || 'Unknown sender'}</span>
                </div>
                <div className="ticket-meta-item">
                    <Calendar size={14} />
                    <span>{formatDateTime(ticket.receivedAt)}</span>
                </div>
                {ticket.conversationId && (
                    <div className="ticket-meta-item" title={ticket.conversationId}>
                        <Inbox size={14} />
                        <span>...{ticket.conversationId.slice(-18)}</span>
                    </div>
                )}
            </div>

            <div className="ticket-body">
                <p>{ticket.bodyPreview || 'No preview content available.'}</p>
            </div>

            <div className="ticket-links">
                <div className="ticket-links-title">
                    <LinkIcon size={14} />
                    <span>Detected links ({ticket.links.length})</span>
                </div>

                {ticket.links.length === 0 ? (
                    <p className="ticket-links-empty">No links found in this email.</p>
                ) : (
                    <div className="ticket-link-list">
                        {ticket.links.map((link, index) => (
                            <a
                                key={`${ticket.id}-${index}-${link.href}`}
                                className="ticket-link-item"
                                href={link.href}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span>{link.text}</span>
                                <ExternalLink size={14} />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </article>
    );
}

export default function OutlookScanPage() {
    const [searchPhrase, setSearchPhrase] = useState(DEFAULT_SEARCH_PHRASE);
    const [limit, setLimit] = useState(10);
    const [result, setResult] = useState<ScanSupportTicketsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAutoScanning, setIsAutoScanning] = useState(false);
    const [lastUpdatedAt, setLastUpdatedAt] = useState<Date>(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    const checkAutoStatus = async () => {
        try {
            const status = await supportTicketsApi.getAutoStatus();
            setIsAutoScanning(status.isScanning);
        } catch (e) {
            console.error("Failed to fetch auto scan status", e);
        }
    };

    const toggleAutoScan = async () => {
        try {
            if (isAutoScanning) {
                await supportTicketsApi.stopAuto();
            } else {
                await supportTicketsApi.startAuto();
            }
            await checkAutoStatus();
        } catch (e) {
            console.error("Failed to toggle auto scan", e);
        }
    };

    const runScan = async (isSilent = false) => {
        if (!isSilent) setLoading(true);
        else setIsRefreshing(true);

        setError('');

        try {
            const data = await supportTicketsApi.scan({
                searchPhrase: searchPhrase.trim() || DEFAULT_SEARCH_PHRASE,
                limit,
            });
            setResult(data);
            setLastUpdatedAt(new Date());
        } catch (err: any) {
            const message = err.response?.data?.error || err.message || 'Scan failed';
            if (!isSilent) setError(message);
            console.error("Scan error:", err);
        } finally {
            if (!isSilent) setLoading(false);
            else setIsRefreshing(false);
        }
    };

    useEffect(() => {
        runScan();
        checkAutoStatus();

        // Cập nhật trạng thái ngầm định kỳ lỡ như server tự ngắt
        const statusInterval = setInterval(checkAutoStatus, 10000);
        return () => clearInterval(statusInterval);
    }, []);

    // Hiệu ứng tự động làm mới khi chế độ Auto Scanning bật
    useEffect(() => {
        let refreshInterval: any = null;

        if (isAutoScanning) {
            // Tự động fetch lại dữ liệu mỗi 1 phút để đồng bộ với những gì hệ thống quét được đồng bộ với backend
            refreshInterval = setInterval(() => {
                runScan(true);
            }, 60000);
        }

        return () => {
            if (refreshInterval) clearInterval(refreshInterval);
        };
    }, [isAutoScanning, searchPhrase, limit]);

    return (
        <div className="outlook-page">
            <section className="glass-panel outlook-hero">
                <div>
                    <div className="ticket-chip ticket-chip-accent">
                        <MailSearch size={14} />
                        <span>Outlook Support Scanner</span>
                    </div>
                    <h1>Scan support emails from Outlook</h1>
                    <p>
                        Search Microsoft Graph inbox messages and return only unread support
                        emails that match your phrase.
                    </p>
                </div>

                <div className="outlook-hero-stats">
                    <div className="outlook-stat">
                        <strong>{result?.total ?? 0}</strong>
                        <span>Unread matched emails</span>
                    </div>
                    <div className="outlook-stat">
                        <strong>{result?.searchPhrase || searchPhrase}</strong>
                        <span>Current search phrase</span>
                    </div>
                </div>
            </section>

            <section className="glass-panel outlook-controls">
                <div className="outlook-control-grid">
                    <div className="form-group">
                        <label>Search phrase</label>
                        <div className="search-bar outlook-search-bar">
                            <Search className="search-icon" size={16} />
                            <input
                                type="text"
                                className="input search-input"
                                value={searchPhrase}
                                onChange={(e) => setSearchPhrase(e.target.value)}
                                placeholder="Keyword inside unread Outlook emails"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Limit</label>
                        <input
                            type="number"
                            className="input"
                            min={1}
                            max={50}
                            value={limit}
                            onChange={(e) => setLimit(Math.min(Math.max(Number(e.target.value) || 1, 1), 50))}
                        />
                    </div>
                </div>

                <div className="outlook-actions">
                    <button className="btn btn-primary" onClick={() => runScan(false)} disabled={loading}>
                        {loading ? <Loader2 className="spinner" size={18} /> : <RefreshCw size={18} />}
                        Run Manual Scan
                    </button>
                    <button className="btn" style={{ marginLeft: '12px', background: isAutoScanning ? '#ef4444' : '#10b981', color: 'white' }} onClick={toggleAutoScan}>
                        {isAutoScanning ? 'Stop Auto Scanning' : 'Start Auto Scanning'}
                    </button>
                    {isAutoScanning && (
                        <div style={{ marginLeft: '12px', display: 'flex', flexDirection: 'column' }}>
                            <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span className={isRefreshing ? "ping-animation" : ""} style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></span>
                                {isRefreshing ? 'Refreshing results...' : 'System is listening for new emails...'}
                            </span>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                                Last sync: {lastUpdatedAt.toLocaleTimeString()}
                            </span>
                        </div>
                    )}
                </div>

                {error && <div className="alert-error" style={{ marginBottom: 0 }}>{error}</div>}
            </section>

            {loading ? (
                <div className="loader-container">
                    <Loader2 className="spinner" size={32} />
                    <p>Scanning unread Outlook emails...</p>
                </div>
            ) : result && result.tickets.length > 0 ? (
                <section className="ticket-results">
                    {result.tickets.map((ticket) => (
                        <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                </section>
            ) : (
                <div className="empty-state glass-panel">
                    <h2>No unread support emails found</h2>
                    <p>Try another search phrase or increase the scan limit.</p>
                </div>
            )}
        </div>
    );
}
