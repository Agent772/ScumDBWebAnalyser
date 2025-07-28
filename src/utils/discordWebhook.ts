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
      form.append('file', file, filename || 'file.txt');
      const res = await fetch(url, {
        method: 'POST',
        body: form,
      });
      return res.ok;
    } else {
      // Send as JSON
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          username: info.username || undefined,
        }),
      });
      return res.ok;
    }
  } catch {
    return false;
  }
}
