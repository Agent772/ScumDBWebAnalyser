import React, { useState } from 'react';
import { getSavedDiscordWebhooks, saveDiscordWebhook, removeDiscordWebhook } from './discordWebhook';
import type { SavedDiscordWebhook } from './discordWebhook';

interface DiscordWebhookManagerModalProps {
  open: boolean;
  onClose: () => void;
}

export const DiscordWebhookManagerModal: React.FC<DiscordWebhookManagerModalProps> = ({ open, onClose }) => {
  const [webhooks, setWebhooks] = useState<SavedDiscordWebhook[]>(getSavedDiscordWebhooks());
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAdd = () => {
    setError(null);
    if (!name.trim() || !url.trim()) {
      setError('Name and URL are required.');
      return;
    }
    if (!/^https:\/\/discord.com\/api\/webhooks\//.test(url)) {
      setError('Invalid Discord webhook URL.');
      return;
    }
    if (webhooks.some(w => w.name === name)) {
      setError('A webhook with this name already exists.');
      return;
    }
    const newWebhook: SavedDiscordWebhook = { name: name.trim(), webhook: url.trim() };
    saveDiscordWebhook(newWebhook);
    setWebhooks(getSavedDiscordWebhooks());
    setName('');
    setUrl('');
  };

  const handleRemove = (webhook: string) => {
    removeDiscordWebhook(webhook);
    setWebhooks(getSavedDiscordWebhooks());
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#232533',
        color: '#fff',
        borderRadius: 10,
        minWidth: 440,
        maxWidth: 540,
        padding: '2.2rem 2.2rem 1.5rem 2.2rem',
        boxShadow: '0 4px 32px rgba(0,0,0,0.18)',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'transparent',
            border: 'none',
            color: '#fff',
            fontSize: 22,
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <svg width="28" height="20" viewBox="0 0 24 24" fill="#7289da" style={{ verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.369A19.791 19.791 0 0 0 16.885 3.1a.074.074 0 0 0-.079.037c-.34.607-.719 1.396-.984 2.013a18.524 18.524 0 0 0-5.59 0 12.51 12.51 0 0 0-.997-2.013.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.069.069 0 0 0-.032.027C1.577 7.651.293 10.818.076 13.946a.08.08 0 0 0 .028.061c2.426 1.778 4.78 2.852 7.084 3.563a.077.077 0 0 0 .084-.027c.547-.75 1.035-1.539 1.426-2.362a.076.076 0 0 0-.041-.104c-.781-.297-1.523-.654-2.241-1.062a.077.077 0 0 1-.008-.127c.151-.114.302-.23.446-.346a.074.074 0 0 1 .077-.01c4.751 2.172 9.87 2.172 14.563 0a.075.075 0 0 1 .078.009c.144.116.295.232.447.346a.077.077 0 0 1-.006.127c-.719.408-1.461.765-2.242 1.062a.076.076 0 0 0-.04.105c.391.822.878 1.611 1.425 2.361a.076.076 0 0 0 .084.028c2.305-.711 4.659-1.785 7.084-3.563a.077.077 0 0 0 .028-.061c-.24-3.127-1.524-6.294-3.569-9.55a.07.07 0 0 0-.033-.027zM8.02 14.331c-1.01 0-1.845-.924-1.845-2.057 0-1.133.818-2.057 1.845-2.057 1.036 0 1.86.933 1.845 2.057 0 1.133-.818 2.057-1.845 2.057zm7.974 0c-1.01 0-1.845-.924-1.845-2.057 0-1.133.818-2.057 1.845-2.057 1.036 0 1.86.933 1.845 2.057 0 1.133-.818 2.057-1.845 2.057z"/></svg>
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#7289da' }}>Manage Discord Webhooks</span>
        </div>
        <div style={{ marginBottom: 18, color: '#bbb', fontSize: '1rem' }}>
          Add, view, or remove Discord webhooks. Saved webhooks are stored in your browser only.
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2%', marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Webhook Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ flex: 1, padding: '0.5em', borderRadius: 5, border: '1px solid #444', background: '#181a23', color: '#fff' }}
              maxLength={32}
            />
            <input
              type="text"
              placeholder="Webhook URL"
              value={url}
              onChange={e => setUrl(e.target.value)}
              style={{ flex: 2, padding: '0.5em', borderRadius: 5, border: '1px solid #444', background: '#181a23', color: '#fff' }}
              maxLength={256}
            />
          </div>
          <button
            onClick={handleAdd}
            style={{ marginLeft: 0, marginTop: 8, width: '100%', padding: '0.6em', borderRadius: 6, border: 'none', background: '#7289da', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            Add Webhook
          </button>
          {error && <div style={{ color: '#f44336', marginTop: 8 }}>{error}</div>}
        </div>
        <div style={{ marginBottom: 10, fontWeight: 600, fontSize: '1.08rem', marginTop: 28, borderTop: '1.5px solid #363a4f', paddingTop: 16, letterSpacing: '0.01em' }}>Saved Webhooks</div>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          maxHeight: 200,
          overflowY: 'auto',
          background: '#23283d',
          borderRadius: 8,
          boxShadow: '0 1px 6px rgba(0,0,0,0.10)',
          border: '1.5px solid #363a4f',
        }}>
          {webhooks.length === 0 && <li style={{ color: '#bbb', fontSize: '0.98rem', padding: '12px 0', textAlign: 'center' }}>No webhooks saved.</li>}
          {webhooks.map(w => (
            <li key={w.webhook} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 10px 0', borderBottom: '1px solid #2d3142', margin: '0 18px' }}>
              <span style={{ color: '#7289da', fontWeight: 600, fontSize: '1.08rem', wordBreak: 'break-all', letterSpacing: '0.01em' }}>{w.name}</span>
              <button
                onClick={() => handleRemove(w.webhook)}
                style={{ background: 'transparent', border: 'none', color: '#f44336', fontWeight: 600, cursor: 'pointer', fontSize: '1.25rem', marginLeft: 16, display: 'flex', alignItems: 'center' }}
                title="Remove Webhook"
                aria-label="Remove Webhook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
