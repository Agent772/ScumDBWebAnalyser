/**
 * Modal component for posting messages to a Discord webhook.
 *
 * Allows users to input a Discord webhook URL, an optional message, username, thread ID, and thread name.
 * Users can also select from previously saved webhooks or save a new webhook for future use.
 *
 * @param open - Whether the modal is open and visible.
 * @param onClose - Callback invoked when the modal is closed.
 * @param onSubmit - Callback invoked with the webhook info when the form is submitted.
 * @param defaultUsername - Optional default username to pre-fill the username field.
 *
 * @returns A modal dialog for configuring and submitting a Discord webhook post, or `null` if not open.
 */
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  getSavedDiscordWebhooks,
  saveDiscordWebhook,
} from './discordWebhook';
import type { SavedDiscordWebhook } from './discordWebhook';
import { COLORS } from '../helpers/colors';

export interface DiscordWebhookInfo {
  webhook: string;
  message?: string;
  username?: string;
  threadId?: string;
  // threadName?: string;
}

interface DiscordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (info: DiscordWebhookInfo) => void;
  defaultUsername?: string;
}
export function DiscordModal({ open, onClose, onSubmit, defaultUsername }: DiscordModalProps) {
  const { t } = useTranslation();
  const [webhook, setWebhook] = useState('');
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState(defaultUsername || '');
  const [threadId, setThreadId] = useState('');
  // const [threadName, setThreadName] = useState('');
  const [saveOptIn, setSaveOptIn] = useState(false);
  const [webhookLabel, setWebhookLabel] = useState('');
  const [saved, setSaved] = useState<SavedDiscordWebhook[]>(getSavedDiscordWebhooks());
  const [selectedSavedIdx, setSelectedSavedIdx] = useState<number>(-1);

  // Accessibility: close on Escape key
  React.useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // When a saved webhook is picked, fill all fields
  function handlePickSaved(idx: number) {
    setSelectedSavedIdx(idx);
    const entry = saved[idx];
    if (!entry) return;
    setWebhook(entry.webhook);
    setUsername(entry.username || '');
    setThreadId(entry.threadId || '');
    // setThreadName('');
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
    // onSubmit({ webhook, message, username, threadId, threadName });
    onSubmit({ webhook, message, username, threadId });
  }

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="discord-modal-title"
      tabIndex={-1}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 2000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <div style={{ background: COLORS.elevation3, color: COLORS.text, borderRadius: 10, padding: '2rem', minWidth: 340, maxWidth: 440, boxShadow: '0 4px 32px #0008', position: 'relative' }}>
        <button onClick={onClose} aria-label={t('close')} style={{ position: 'absolute', top: 10, right: 14, background: 'none', border: 'none', color: COLORS.text, fontSize: 22, cursor: 'pointer' }} title={t('close')}>×</button>
        <h2 id="discord-modal-title" style={{ color: '#7289da', marginTop: 0, marginBottom: 18, fontWeight: 700 }}>{t('discord.post_to_discord')}</h2>
        <form onSubmit={handleSubmit}>
          {/* Saved webhooks dropdown */}
          {saved.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>{t('discord.pick_saved_webhook')}</label>
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
                <option value={-1}>-- {t('select')} --</option>
                {saved.map((w, i) => (
                  <option key={w.webhook} value={i}>{w.name} ({w.webhook.slice(0, 28)}...)</option>
                ))}
              </select>
            </div>
          )}
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>{t('discord.webhook_url')}</label>
          <input
            type="url"
            required
            value={webhook}
            onChange={e => setWebhook(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em' }}
            disabled={selectedSavedIdx !== -1}
          />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>{t('discord.message_optional')}</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder={t('discord.message_placeholder')} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em', minHeight: 60 }} />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>{t('discord.bot_username')}</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder={t('discord.bot_username')} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 14, fontSize: '1em' }} />
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>{t('discord.thread_id_label')}</label>
          <input type="text" value={threadId} onChange={e => setThreadId(e.target.value)} placeholder={t('discord.thread_id_label')} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 10, fontSize: '1em' }} />
          {/*
          <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>{t('discord.thread_name_label')}</label>
          <input type="text" value={threadName} onChange={e => setThreadName(e.target.value)} placeholder={t('thread_name_placeholder')} style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #7289da', marginBottom: 10, fontSize: '1em' }} />
          */}
          {/* Save webhook opt-in */}
          <div style={{ marginBottom: 12, marginTop: 2 }}>
            <input
              type="checkbox"
              id="save-webhook"
              checked={saveOptIn}
              onChange={e => setSaveOptIn(e.target.checked)}
              disabled={selectedSavedIdx !== -1}
            />
            <label htmlFor="save-webhook" style={{ marginLeft: 7, fontSize: '0.98em', color: selectedSavedIdx !== -1 ? '#888' : undefined }}>{t('discord.save_webhook_for_later')}</label>
            {saveOptIn && selectedSavedIdx === -1 && (
              <input type="text" value={webhookLabel} onChange={e => setWebhookLabel(e.target.value)} placeholder={t('discord.webhook_label_placeholder')} style={{ width: '100%', marginTop: 7, padding: 7, borderRadius: 4, border: '1px solid #7289da', fontSize: '1em' }} />
            )}
          </div>
          <button type="submit" style={{ width: '100%', background: '#7289da', color: '#fff', border: 'none', borderRadius: 6, padding: '0.7em', fontWeight: 700, fontSize: '1.1em', cursor: 'pointer', marginBottom: 6 }}>{t('continue')}</button>
        </form>
        {/* Usage statement */}
        <div style={{ fontSize: '0.93em', color: '#bbb', marginTop: 10, marginBottom: 2 }}>{t('discord.discord_webhook_storage_statement')}</div>
      </div>
    </div>
  );
}
