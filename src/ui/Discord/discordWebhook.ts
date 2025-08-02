/**
 * Post multiple files to a Discord webhook, sending each as a separate message.
 * @param info DiscordWebhookInfo (webhook, username, threadId, etc)
 * @param content The message content to send (optional if file is present)
 * @param files Array of { blob, name }
 * @returns Promise that resolves to true if all successful, false otherwise
 */
export async function postMultipleFilesToDiscordWebhook(
  info: DiscordWebhookInfo,
  content: string,
  files: { blob: Blob; name: string }[]
): Promise<boolean> {
  let allOk = true;
  for (const file of files) {
    const ok = await postToDiscordWebhook(info, content, file.blob, file.name);
    if (!ok) allOk = false;
  }
  return allOk;
}
// --- Modular Discord webhook storage (localStorage, opt-in) ---

const WEBHOOKS_KEY = 'scumdb_saved_discord_webhooks';

export interface SavedDiscordWebhook {
  name: string; // user label
  webhook: string;
  username?: string;
  threadId?: string;
}

/**
 * Get all saved Discord webhooks from localStorage.
 * Returns an array of { name, webhook, username, threadId }
 */
export function getSavedDiscordWebhooks(): SavedDiscordWebhook[] {
  try {
    const raw = localStorage.getItem(WEBHOOKS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch {
    return [];
  }
}

/**
 * Save a new Discord webhook (opt-in). If a webhook with the same URL exists, it is replaced.
 */
export function saveDiscordWebhook(entry: SavedDiscordWebhook) {
  const all = getSavedDiscordWebhooks();
  const filtered = all.filter(w => w.webhook !== entry.webhook);
  filtered.push(entry);
  localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(filtered));
}

/**
 * Remove a saved Discord webhook by webhook URL.
 */
export function removeDiscordWebhook(webhook: string) {
  const all = getSavedDiscordWebhooks();
  const filtered = all.filter(w => w.webhook !== webhook);
  localStorage.setItem(WEBHOOKS_KEY, JSON.stringify(filtered));
}

/**
 * Clear all saved Discord webhooks (for user opt-out).
 */
export function clearAllDiscordWebhooks() {
  localStorage.removeItem(WEBHOOKS_KEY);
}

/**
 * Usage statement for UI: Only if user opts in, Discord webhooks are saved in your browser (localStorage), never sent anywhere else. You can remove them at any time.
 */
export const DISCORD_WEBHOOK_STORAGE_STATEMENT =
  'If you choose to save a Discord webhook, it will be stored only in your browser (localStorage) and never sent anywhere else. You can remove saved webhooks at any time.';
// Utility for posting messages to a Discord webhook from the browser


import type { DiscordWebhookInfo } from './DiscordModal';

export interface DiscordWebhookOptions {
  username?: string;
  avatar_url?: string;
  content?: string;
  thread_id?: string;
  embeds?: Record<string, unknown>[];
}


/**
 * Post a message to a Discord webhook URL using info from the modal and a message.
 * @param info DiscordWebhookInfo (webhook, username, threadId, etc)
 * @param content The message content to send
 * @returns Promise that resolves to true if successful, false otherwise
 */
/**
 * Post a message to a Discord webhook URL, optionally with a file attachment.
 * @param info DiscordWebhookInfo (webhook, username, threadId, etc)
 * @param content The message content to send (optional if file is present)
 * @param file Optional: File to attach (Blob or File)
 * @param filename Optional: Filename for the attachment
 * @returns Promise that resolves to true if successful, false otherwise
 */
export async function postToDiscordWebhook(
  info: DiscordWebhookInfo,
  content: string,
  file?: Blob,
  filename?: string
): Promise<boolean> {
  try {
    let url = info.webhook;
    if (info.threadId) {
      // Discord thread_id is passed as a query param
      const sep = url.includes('?') ? '&' : '?';
      url += `${sep}thread_id=${encodeURIComponent(info.threadId)}`;
    }
    if (file) {
      // Send as multipart/form-data
      const form = new FormData();
      if (content) form.append('content', content);
      if (info.username) form.append('username', info.username);
      // if (info.threadName) form.append('thread_name', info.threadName);
      form.append('file', file, filename || 'file.txt');
      const res = await fetch(url, {
        method: 'POST',
        body: form,
      });
      return res.ok;
    } else {
      // Send as JSON
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const body: Record<string, any> = {
        content,
        username: info.username || undefined,
      };
      // if (info.threadName) body.thread_name = info.threadName;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      return res.ok;
    }
  } catch {
    return false;
  }
}
