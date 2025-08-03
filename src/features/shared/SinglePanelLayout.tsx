/**
 * A layout component that renders a single analysis panel with a header, optional status, actions, and export/Discord integration.
 *
 * Provides functionality to export the panel as an image or send it to a Discord webhook.
 * The panel content can be rendered as static children or as a render function that receives an object with `disableAnimation` (useful for disabling animations during export).
 *
 * @param header - The header content displayed at the top of the panel.
 * @param panelRef - Optional ref to the panel's root div, used for exporting as an image.
 * @param children - The panel content, either as a React node or a render function receiving `{ disableAnimation }`.
 * @param className - Optional CSS class for the panel container.
 * @param style - Optional inline styles for the panel container.
 * @param status - Optional status node displayed above the panel.
 * @param actions - Optional additional action elements rendered next to the export/Discord buttons.
 * @param exportFileName - Optional file name for the exported image (default: 'analysis-panel.png').
 * @param discordFileName - Optional file name for the image sent to Discord (default: 'analysis-panel.png').
 * @param height - Optional height for the panel container (default: '89vh').
 *
 * @returns The single panel layout with export and Discord integration.
 */
import React from 'react';
import { type ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { exportAsImage } from '../../ui/Export/exportAsImage';
import { DiscordModal } from '../../ui/Discord/DiscordModal';
import { postToDiscordWebhook } from '../../ui/Discord/discordWebhook';
import type { DiscordWebhookInfo } from '../../ui/Discord/DiscordModal';
import { DiscordIcon } from '../../ui/Discord/DiscordIcon';
import { COLORS } from '../../ui/helpers/colors';
import '../../index.css'; // Ensure styles are applied

interface SinglePanelLayoutProps {
  header: ReactNode;
  panelRef?: { current: HTMLDivElement | null };
  children: ((props: { disableAnimation: boolean }) => React.ReactNode) | React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  status?: ReactNode;
  actions?: ReactNode;
  exportFileName?: string;
  discordFileName?: string;
  height?: string;
}

export function SinglePanelLayout({
  header,
  panelRef,
  children,
  className = '',
  style = {},
  status,
  actions,
  exportFileName = 'analysis-panel.png',
  discordFileName = 'analysis-panel.png',
  height = '89vh',
}: SinglePanelLayoutProps) {
  const { t } = useTranslation();
  const [discordOpen, setDiscordOpen] = useState(false);
  // Discord status: { type: 'success' | 'error', message: string }
  const [discordStatus, setDiscordStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [exporting, setExporting] = useState(false);

  // Temporarily set disableAnimation to true during export
  const handleExport = async () => {
    if (panelRef?.current) {
      setExporting(true);
      await new Promise(r => setTimeout(r, 30));
      await exportAsImage(panelRef.current, { fileName: exportFileName });
      setExporting(false);
    }
  };

  const handleDiscordSend = async (info: DiscordWebhookInfo) => {
    setDiscordStatus(null);
    if (!panelRef?.current) {
      setDiscordStatus({ type: 'error', message: t('discord.panel_not_found') });
      return;
    }
    setExporting(true);
    await new Promise(r => setTimeout(r, 30));
    const dataUrl = await exportAsImage(panelRef.current, { returnDataUrl: true, fileName: discordFileName }) as string;
    setExporting(false);
    if (!dataUrl) {
      setDiscordStatus({ type: 'error', message: t('single_panel.failed_export') });
      return;
    }
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ok = await postToDiscordWebhook(info, info.message || '', blob, discordFileName);
    setDiscordStatus(ok
      ? { type: 'success', message: t('discord.posted') }
      : { type: 'error', message: t('discord.failed') }
    );
    if (ok) setDiscordOpen(false);
  };

  return (
    <section style={{ width: '100%', ...style }} aria-label="Analysis panel">
      {discordOpen && (
        <DiscordModal
          open={discordOpen}
          onClose={() => setDiscordOpen(false)}
          onSubmit={handleDiscordSend}
        />
      )}
      {discordStatus && (
        <div
          role="status"
          aria-live="polite"
          style={{ color: discordStatus.type === 'success' ? COLORS.success : COLORS.error, fontWeight: 600, margin: '10px 0' }}
        >
          {discordStatus.message}
        </div>
      )}
      {status && status}
      <div
        ref={panelRef}
        className={className}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gridTemplateRows: 'repeat(13, auto)',
          gap: 16,
          width: '100%',
          margin: '0 auto',
          minHeight: 0,
          height: height,
          alignItems: 'center',
        }}
        role="region"
        aria-label="Panel content"
      >
        {/* Header and actions in the same grid row */}
        <h2
          style={{
            color: COLORS.primary,
            fontWeight: 700,
            fontSize: '2rem',
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.01em',
            gridColumn: '1 / 13',
            gridRow: '1 / 2',
            alignSelf: 'center',
          }}
          tabIndex={0}
        >
          {header}
        </h2>
        <div
          style={{
            gridColumn: '9 / 13',
            gridRow: '1 / 2',
            justifySelf: 'end',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <button
            type="button"
            className='btn-download'
            aria-label={t('single_panel.export_panel_as_image_aria')}
            onClick={handleExport}
          >
            {t('single_panel.export_panel_as_image')}
          </button>
          <button
            type="button"
            className="btn-discord"
            aria-label={t('single_panel.send_panel_to_discord_aria')}
            onClick={() => setDiscordOpen(true)}
          >
            <DiscordIcon width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            {t('single_panel.send_panel_to_discord')}
          </button>
          {actions}
        </div>
        {typeof children === 'function'
          ? children({ disableAnimation: exporting })
          : children}
      </div>
    </section>
  );
}
