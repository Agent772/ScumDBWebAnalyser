/**
 * MultiPanelLayout is a React component that manages and displays multiple panel groups,
 * allowing users to navigate between them, export all panels as images in a zip file,
 * or send all panels as images to a Discord webhook.
 *
 * @remarks
 * - Each panel group is rendered using the `SinglePanelLayout` component.
 * - Only the currently selected panel group is visible; others are hidden but remain in the DOM for export purposes.
 * - Provides keyboard navigation (ArrowLeft/ArrowRight) for switching between panel groups.
 * - Supports exporting all panel groups as PNG images in a zip file.
 * - Supports sending all panel images to a Discord webhook via a modal dialog.
 *
 * @param groupCount - The number of panel groups to display.
 * @param getPanelHeader - Optional function to generate a header for each panel group.
 * @param getPanelFileName - Optional function to generate a file name for each panel group's exported image.
 * @param children - Render prop function to render the content of each panel group.
 * @param exportZipName - Optional name for the exported zip file (default: 'multi-panel-analysis.zip').
 *
 * @example
 * ```tsx
 * <MultiPanelLayout
 *   groupCount={3}
 *   getPanelHeader={i => `Group ${i + 1}`}
 *   getPanelFileName={i => `group-${i + 1}.png`}
 *   exportZipName="analysis.zip"
 * >
 *   {(i, { disableAnimation }) => <PanelContent groupIndex={i} disableAnimation={disableAnimation} />}
 * </MultiPanelLayout>
 * ```
 */
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SinglePanelLayout } from './SinglePanelLayout';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportAsImage } from '../../ui/Export/exportAsImage';
import { DiscordModal } from '../../ui/Discord/DiscordModal';
import type { DiscordWebhookInfo } from '../../ui/Discord/DiscordModal';
import { postMultipleFilesToDiscordWebhook } from '../../ui/Discord/discordWebhook';
import { DiscordIcon } from '../../ui/Discord/DiscordIcon';
import { COLORS } from '../../ui/helpers/colors';
import '../../index.css'; // Ensure styles are applied


export interface MultiPanelLayoutProps {
  groupCount: number;
  getPanelHeader?: (groupIndex: number) => React.ReactNode;
  getPanelFileName?: (groupIndex: number) => string;
  children?: (groupIndex: number, props: { disableAnimation: boolean }) => React.ReactNode;
  exportZipName?: string;
}

export function MultiPanelLayout({
  groupCount,
  getPanelHeader = i => `Panel Group ${i + 1}`,
  getPanelFileName = i => `panel-group-${i + 1}.png`,
  children,
  exportZipName = 'multi-panel-analysis.zip',
}: MultiPanelLayoutProps) {
  const { t } = useTranslation();
  const [currentGroup, setCurrentGroup] = useState(0);
  const [discordOpen, setDiscordOpen] = useState(false);
  const [discordStatus, setDiscordStatus] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  // Use array of refs, always length groupCount, with nulls
  const panelRefs = useRef<(HTMLDivElement | null)[]>(Array(groupCount).fill(null));

  // Keyboard navigation for group buttons
  const navButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Navigation buttons for header
  const navButtons = (
    <nav aria-label={t('multi_panel.panel_group_navigation')} style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: groupCount }).map((_, i) => (
        <button
          key={i}
          aria-label={t('multi_panel.show_group', { group: i + 1 })}
          aria-current={i === currentGroup ? 'page' : undefined}
          ref={el => {
            navButtonRefs.current[i] = el;
          }}
          style={{
            background: i === currentGroup ? COLORS.primary : COLORS.elevation4,
            color: i === currentGroup ? COLORS.textSecondary : COLORS.text,
            border: `1px solid ${COLORS.primaryBorder}`,
            borderRadius: 4,
            padding: '2px 8px',
            fontWeight: 700,
            cursor: 'pointer',
            outline: i === currentGroup ? `2px solid ${COLORS.primary}` : undefined,
          }}
          tabIndex={0}
          onClick={() => setCurrentGroup(i)}
          onKeyDown={e => {
            if (e.key === 'ArrowRight') {
              e.preventDefault();
              const next = (i + 1) % groupCount;
              setCurrentGroup(next);
              navButtonRefs.current[next]?.focus();
            } else if (e.key === 'ArrowLeft') {
              e.preventDefault();
              const prev = (i - 1 + groupCount) % groupCount;
              setCurrentGroup(prev);
              navButtonRefs.current[prev]?.focus();
            }
          }}
        >
          {i + 1}
        </button>
      ))}
    </nav>
  );

  // Export all groups as images in a zip, making each panel visible for export
  const handleExportAll = async () => {
    setExporting(true);
    const zip = new JSZip();
    const originalGroup = currentGroup;
    for (let i = 0; i < groupCount; i++) {
      await new Promise<void>(resolve => {
        setCurrentGroup(i);
        setTimeout(resolve, 120);
      });
      const ref = panelRefs.current[i];
      if (ref) {
        const dataUrl = await exportAsImage(ref, { returnDataUrl: true, fileName: getPanelFileName(i) });
        if (typeof dataUrl === 'string') {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          zip.file(getPanelFileName(i), blob);
        }
      }
    }
    setCurrentGroup(originalGroup);
    setExporting(false);
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, exportZipName);
  };

  // Send all images to Discord in one message
  const handleDiscordSend = async (info: DiscordWebhookInfo) => {
    setDiscordOpen(false); // Close modal before exporting
    setExporting(true); // Skip animations
    setDiscordStatus(null);
    const files: { blob: Blob; name: string }[] = [];
    const originalGroup = currentGroup;
    for (let i = 0; i < groupCount; i++) {
      await new Promise<void>(resolve => {
        setCurrentGroup(i);
        setTimeout(resolve, 120);
      });
      const ref = panelRefs.current[i];
      if (ref) {
        const dataUrl = await exportAsImage(ref, { returnDataUrl: true, fileName: getPanelFileName(i) });
        if (typeof dataUrl === 'string') {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          files.push({ blob, name: getPanelFileName(i) });
        }
      }
    }
    setCurrentGroup(originalGroup);
    setExporting(false);
    if (files.length === 0) {
      setDiscordStatus('No images to send.');
      return;
    }
    const ok = await postMultipleFilesToDiscordWebhook(info, info.message || '', files);
    setDiscordStatus(ok ? 'Posted all images to Discord!' : 'Failed to post. Check the webhook URL and try again.');
    if (ok) setDiscordOpen(false);
  };

  return (
    <main style={{ width: '100%' }} aria-label="Multi-panel analysis">
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
        {navButtons}
        <button
          type="button"
          className="btn-download"
          aria-label={t('multi_panel.export_all_as_zip_aria')}
          onClick={handleExportAll}
        >
          {t('multi_panel.export_all_as_zip')}
        </button>
        <button
          type="button"
          className="btn-discord"
          aria-label={t('multi_panel.send_all_to_discord_aria')}
          onClick={() => setDiscordOpen(true)}
        >
          <DiscordIcon width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {t('multi_panel.send_all_to_discord')}
        </button>
      </header>
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
          style={{ color: discordStatus.startsWith(t('multi_panel.status_posted_prefix')) ? COLORS.success : COLORS.error, fontWeight: 600, margin: '10px 0' }}
        >
          {discordStatus}
        </div>
      )}
      {/* Render all panels, but only show the current one. Others are hidden but in DOM for export. */}
      {Array.from({ length: groupCount }).map((_, i) => {
        // Always provide a valid RefObject for panelRef
        const panelRefObj = { current: panelRefs.current[i] as HTMLDivElement | null };
        return (
          <section
            key={i}
            ref={el => {
              panelRefs.current[i] = el as HTMLDivElement | null;
            }}
            style={{ display: i === currentGroup ? 'block' : 'none' }}
            aria-label={`Panel group ${i + 1}`}
            aria-hidden={i !== currentGroup}
          >
            <SinglePanelLayout
              header={getPanelHeader(i)}
              panelRef={panelRefObj}
              height='85vh'
            >
              {children ? children(i, { disableAnimation: exporting }) : null}
            </SinglePanelLayout>
          </section>
        );
      })}
    </main>
  );
}
