import React, { useState } from 'react';
import { allocationApi } from '../api/client';
import { Layers, Play, TestTube, Loader2, Clipboard } from 'lucide-react';
import { CustomSelect } from '../components/CustomSelect';

export default function AllocationPage() {
    const [leadId, setLeadId] = useState('');
    const [crmVersion, setCrmVersion] = useState<'v1' | 'v2'>('v2');
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const handleAllocate = async (dryRun: boolean) => {
        if (!leadId.trim()) {
            alert('Please enter a Lead ID');
            return;
        }

        setLoading(true);
        setLogs([`Triggering ${dryRun ? 'Dry Run' : 'Real'} allocation...`]);

        try {
            const res = await allocationApi.allocate({
                leadId: leadId.trim(),
                dryRun,
                crmVersion
            });
            setLogs(res.logs);
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || error.message;
            setLogs(prev => [...prev, `❌ ERROR: ${errorMsg}`]);
        } finally {
            setLoading(false);
        }
    };

    const copyLogs = () => {
        navigator.clipboard.writeText(logs.join('\n'));
        alert('Logs copied to clipboard!');
    };

    return (
        <div className="note-form-container">
            <div className="form-header">
                <Layers size={24} className="text-accent" />
                <h2>CRM Payment Allocation</h2>
            </div>

            <p style={{ marginBottom: '1.5rem', opacity: 0.8 }}>
                Distribute and reset lead payment allocations across product items.
            </p>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <div className="note-form">
                    <div className="form-group">
                        <label>Lead ID</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="Enter Lead ID (e.g. 69cdc497...)"
                            value={leadId}
                            onChange={(e) => setLeadId(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>CRM Version</label>
                        <CustomSelect
                            value={crmVersion}
                            onChange={(val) => setCrmVersion(val as any)}
                            options={[
                                { value: 'v1', label: 'Version 1 (Legacy)' },
                                { value: 'v2', label: 'Version 2 (Modern)' }
                            ]}
                        />
                    </div>

                    <div className="form-actions" style={{ gap: '1rem', justifyContent: 'flex-start' }}>
                        <button
                            className="btn btn-ghost"
                            onClick={() => handleAllocate(true)}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="spinner" size={18} /> : <TestTube size={18} />}
                            Dry Run
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => handleAllocate(false)}
                            disabled={loading}
                            style={{ background: 'var(--danger)' }}
                        >
                            {loading ? <Loader2 className="spinner" size={18} /> : <Play size={18} />}
                            Run Real
                        </button>
                    </div>
                </div>
            </div>

            {(logs.length > 0 || loading) && (
                <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(0,0,0,0.4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>Process Logs</h3>
                        <button className="action-btn" onClick={copyLogs} title="Copy logs">
                            <Clipboard size={16} />
                        </button>
                    </div>
                    <pre style={{
                        maxHeight: '400px',
                        overflowY: 'auto',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        color: 'var(--text-secondary)',
                        whiteSpace: 'pre-wrap',
                        lineHeight: '1.4'
                    }}>
                        {logs.map((log, i) => (
                            <div key={i} style={{
                                marginBottom: '4px',
                                borderLeft: '2px solid rgba(255,255,255,0.1)',
                                paddingLeft: '8px'
                            }}>
                                {log}
                            </div>
                        ))}
                    </pre>
                </div>
            )}
        </div>
    );
}
