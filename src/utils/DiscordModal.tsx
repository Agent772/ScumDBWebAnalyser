import React, { useState } from 'react';

export interface DiscordWebhookInfo {
  webhook: string;
  message?: string;
  username?: string;
  threadId?: string;
}

interface DiscordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (info: DiscordWebhookInfo) => void;
  defaultUsername?: string;
}

export function DiscordModal({ open, onClose, onSubmit, defaultUsername }: DiscordModalProps) {
  const [webhook, setWebhook] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(defaultUsername || '');
  const [threadId, setThreadId] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!webhook) return;
    onSubmit({ webhook, message, username, threadId });
  }

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: '#232533', color: '#fff', borderRadius: 10, padding: '2rem', minWidth: 340, maxWidth: 420, boxShadow: '0 4px 32px #0008', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }} title="Close">×</button>
        <h2 style={{ color: '#7289da', marginTop: 0, marginBottom: 18, fontWeight: 700 }}>Post to Discord</h2>
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Webhook URL</label>
          <input type="url" required value={webhook} onChange={e => setWebhook(e.target.value)} placeholder="https://discord.com/api/webhooks/..." style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em' }} />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Message (optional)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message to include above the analysis..." style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em', minHeight: 60 }} />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Username (optional)</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Bot Username" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em' }} />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Thread ID (optional)</label>
          <input type="text" value={threadId} onChange={e => setThreadId(e.target.value)} placeholder="Thread ID for forum posts" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 18, fontSize: '1em' }} />
          <button type="submit" style={{ width: '100%', background: '#7289da', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7em', fontWeight: 700, fontSize: '1.1em', cursor: 'pointer', marginBottom: 6 }}>Continue</button>
        </form>
      </div>
    </div>
  );
}
