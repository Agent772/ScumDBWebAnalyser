/**
 * Modal component for managing Discord webhooks.
 *
 * Allows users to add, view, and remove Discord webhooks, which are stored locally in the browser.
 * Provides input validation for webhook name and URL, and displays error messages for invalid input.
 * Displays a list of saved webhooks with the ability to remove individual entries.
 *
 * @param {DiscordWebhookManagerModalProps} props - The component props.
 * @param {boolean} props.open - Whether the modal is open.
 * @param {() => void} props.onClose - Callback to close the modal.
 *
 * @returns {JSX.Element | null} The rendered modal component, or null if not open.
 */
import React, { useState } from 'react';
import { getSavedDiscordWebhooks, saveDiscordWebhook, removeDiscordWebhook } from './discordWebhook';
import type { SavedDiscordWebhook } from './discordWebhook';
import { COLORS } from '../helpers/colors';
import { DiscordIcon } from './DiscordIcon';

// Extended type for local use (backward compatible)
type SavedDiscordWebhookExtended = SavedDiscordWebhook & {
  username?: string;
  threadId?: string;
};

interface DiscordWebhookManagerModalProps {
  open: boolean;
  onClose: () => void;
}

export const DiscordWebhookManagerModal: React.FC<DiscordWebhookManagerModalProps> = ({ open, onClose }) => {
  const [webhooks, setWebhooks] = useState<SavedDiscordWebhookExtended[]>(getSavedDiscordWebhooks() as SavedDiscordWebhookExtended[]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [threadId, setThreadId] = useState('');
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
    const newWebhook: SavedDiscordWebhookExtended = {
      name: name.trim(),
      webhook: url.trim(),
      username: username.trim() || undefined,
      threadId: threadId.trim() || undefined,
    };
    saveDiscordWebhook(newWebhook);
    setWebhooks(getSavedDiscordWebhooks() as SavedDiscordWebhookExtended[]);
    setName('');
    setUrl('');
    setUsername('');
    setThreadId('');
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
      zIndex: 2000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: COLORS.elevation3,
        color: COLORS.text,
        borderRadius: 10,
        minWidth: 440,
        maxWidth: 540,
        padding: '2.2rem 2.2rem 1.5rem 2.2rem',
        boxShadow: COLORS.shadow,
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
            color: COLORS.text,
            fontSize: 22,
            cursor: 'pointer',
          }}
          aria-label="Close"
        >
          ×
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <DiscordIcon />
          <span style={{ fontWeight: 700, fontSize: '1.25rem', color: '#7289da' }}>Manage Discord Webhooks</span>
        </div>
        <div style={{ marginBottom: 18, color: COLORS.text, fontSize: '1rem' }}>
          Add, view, or remove Discord webhooks. Saved webhooks are stored in your browser only.
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2%', marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Webhook Name"
              value={name}
              onChange={e => setName(e.target.value)}
              style={{ flex: 1, padding: '0.5em', borderRadius: 5, border: '1px solid #444', background: COLORS.elevation4, color: COLORS.text }}
              maxLength={32}
            />
            <input
              type="text"
              placeholder="Webhook URL"
              value={url}
              onChange={e => setUrl(e.target.value)}
              style={{ flex: 2, padding: '0.5em', borderRadius: 5, border: '1px solid #444', background: COLORS.elevation4, color: COLORS.text }}
              maxLength={256}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '2%', marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Username (optional)"
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={{ flex: 1, padding: '0.5em', borderRadius: 5, border: '1px solid #444', background: COLORS.elevation4, color: COLORS.text }}
              maxLength={32}
            />
            <input
              type="text"
              placeholder="Thread ID (optional)"
              value={threadId}
              onChange={e => setThreadId(e.target.value)}
              style={{ flex: 1, padding: '0.5em', borderRadius: 5, border: '1px solid #444', background: COLORS.elevation4, color: COLORS.text }}
              maxLength={64}
            />
          </div>
          <button
            onClick={handleAdd}
            style={{ marginLeft: 0, marginTop: 8, width: '100%', padding: '0.6em', borderRadius: 6, border: 'none', background: '#7289da', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
          >
            Add Webhook
          </button>
          {error && <div style={{ color: COLORS.error, marginTop: 8 }}>{error}</div>}
        </div>
        <div style={{ marginBottom: 10, fontWeight: 600, fontSize: '1.08rem', marginTop: 28, borderTop: '1.5px solid #363a4f', paddingTop: 16, letterSpacing: '0.01em' }}>Saved Webhooks</div>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          maxHeight: 200,
          overflowY: 'auto',
          background: COLORS.elevation4,
          borderRadius: 8,
          boxShadow: COLORS.shadow,
          border: '1.5px solid #363a4f',
        }}>
          {webhooks.length === 0 && <li style={{ color: COLORS.text, fontSize: '0.98rem', padding: '12px 0', textAlign: 'center' }}>No webhooks saved.</li>}
          {webhooks.map(w => (
            <li key={w.webhook} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0 10px 0', borderBottom: '1px solid #2d3142', margin: '0 18px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', flex: 1 }}>
                <span style={{ color: '#7289da', fontWeight: 600, fontSize: '1.08rem', wordBreak: 'break-all', letterSpacing: '0.01em' }}>{w.name}</span>
                {w.username && <span style={{ color: COLORS.text, fontSize: '0.97em', marginTop: 2 }}>Username: <b>{w.username}</b></span>}
                {w.threadId && <span style={{ color: COLORS.text, fontSize: '0.97em', marginTop: 2 }}>Thread ID: <b>{w.threadId}</b></span>}
              </div>
              <button
                onClick={() => handleRemove(w.webhook)}
                style={{ background: 'transparent', border: 'none', color: COLORS.error, fontWeight: 600, cursor: 'pointer', fontSize: '1.25rem', marginLeft: 16, display: 'flex', alignItems: 'center' }}
                title="Remove Webhook"
                aria-label="Remove Webhook"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={COLORS.error} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
