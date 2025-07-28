import React, { useState } from 'react';
import {
  getSavedDiscordWebhooks,
  saveDiscordWebhook,
  removeDiscordWebhook,
  DISCORD_WEBHOOK_STORAGE_STATEMENT,
} from './discordWebhook';
import type { SavedDiscordWebhook } from './discordWebhook';

export interface DiscordWebhookInfo {
  webhook: string;
  message?: string;
  username?: string;
  threadId?: string;
  threadName?: string;
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
  const [threadName, setThreadName] = useState('');
  const [saveOptIn, setSaveOptIn] = useState(false);
  const [webhookLabel, setWebhookLabel] = useState('');
  const [saved, setSaved] = useState<SavedDiscordWebhook[]>(getSavedDiscordWebhooks());
  const [selectedSavedIdx, setSelectedSavedIdx] = useState<number>(-1);

  // When a saved webhook is picked, fill all fields
  function handlePickSaved(idx: number) {
    setSelectedSavedIdx(idx);
    const entry = saved[idx];
    if (!entry) return;
    setWebhook(entry.webhook);
    setUsername(entry.username || '');
    setThreadId(entry.threadId || '');
    setThreadName('');
    setWebhookLabel(entry.name || '');
    setSaveOptIn(false);
  }

  function handleSaveWebhook() {
    if (!webhook || !webhookLabel.trim()) return;
    saveDiscordWebhook({
      name: webhookLabel.trim(),
      webhook,
      username: username || undefined,
      threadId: threadId || undefined,
    });
    setSaved(getSavedDiscordWebhooks());
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!webhook) return;
    if (selectedSavedIdx === -1 && saveOptIn && webhookLabel.trim()) {
      handleSaveWebhook();
    }
    onSubmit({ webhook, message, username, threadId, threadName });
  }

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.45)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: '#232533', color: '#fff', borderRadius: 10, padding: '2rem', minWidth: 340, maxWidth: 440, boxShadow: '0 4px 32px #0008', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', color: '#fff', fontSize: 22, cursor: 'pointer' }} title="Close">×</button>
        <h2 style={{ color: '#7289da', marginTop: 0, marginBottom: 18, fontWeight: 700 }}>Post to Discord</h2>
        <form onSubmit={handleSubmit}>
          {/* Saved webhooks dropdown */}
          {saved.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Pick Saved Webhook</label>
              <select
                value={selectedSavedIdx}
                onChange={e => {
                  const idx = Number(e.target.value);
                  if (idx >= 0) handlePickSaved(idx);
                  else {
                    setSelectedSavedIdx(-1);
                    setWebhook('');
                    setUsername(defaultUsername || '');
                    setThreadId('');
                    setWebhookLabel('');
                  }
                }}
                style={{ width: '100%', padding: 7, borderRadius: 4, border: '1px solid #7289da', fontSize: '1em', marginBottom: 4 }}
              >
                <option value={-1}>-- Select --</option>
                {saved.map((w, i) => (
                  <option key={w.webhook} value={i}>{w.name} ({w.webhook.slice(0, 28)}...)</option>
                ))}
              </select>
            </div>
          )}
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Webhook URL</label>
          <input
            type="url"
            required
            value={webhook}
            onChange={e => setWebhook(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em' }}
            disabled={selectedSavedIdx !== -1}
          />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Message (optional)</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message to include above the analysis..." style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em', minHeight: 60 }} />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Username (optional)</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Bot Username" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em' }} />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Thread ID (optional)</label>
          <input type="text" value={threadId} onChange={e => setThreadId(e.target.value)} placeholder="Thread ID for forum posts" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 10, fontSize: '1em' }} />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>Thread Name (optional)</label>
          <input type="text" value={threadName} onChange={e => setThreadName(e.target.value)} placeholder="Thread name for new forum thread" style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 10, fontSize: '1em' }} />
          {/* Save webhook opt-in */}
          <div style={{ marginBottom: 12, marginTop: 2 }}>
            <input
              type="checkbox"
              id="save-webhook"
              checked={saveOptIn}
              onChange={e => setSaveOptIn(e.target.checked)}
              disabled={selectedSavedIdx !== -1}
            />
            <label htmlFor="save-webhook" style={{ marginLeft: 7, fontSize: '0.98em', color: selectedSavedIdx !== -1 ? '#888' : undefined }}>Save this webhook for later use</label>
            {saveOptIn && selectedSavedIdx === -1 && (
              <input type="text" value={webhookLabel} onChange={e => setWebhookLabel(e.target.value)} placeholder="Label for this webhook" style={{ width: '100%', marginTop: 7, padding: 7, borderRadius: 4, border: '1px solid #7289da', fontSize: '1em' }} />
            )}
          </div>
          <button type="submit" style={{ width: '100%', background: '#7289da', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7em', fontWeight: 700, fontSize: '1.1em', cursor: 'pointer', marginBottom: 6 }}>Continue</button>
        </form>
        {/* Usage statement */}
        <div style={{ fontSize: '0.93em', color: '#bbb', marginTop: 10, marginBottom: 2 }}>{DISCORD_WEBHOOK_STORAGE_STATEMENT}</div>
      </div>
    </div>
  );
}
