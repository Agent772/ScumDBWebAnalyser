import React, { useRef, useState } from 'react';
import { SinglePanelLayout } from './SinglePanelLayout';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { exportAsImage } from '../../ui/Export/exportAsImage';
import { DiscordModal } from '../../ui/Discord/DiscordModal';
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
  const [currentGroup, setCurrentGroup] = useState(0);
  const [discordOpen, setDiscordOpen] = useState(false);
  const [discordStatus, setDiscordStatus] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  // Use array of refs, always length groupCount, with nulls
  const panelRefs = useRef<(HTMLDivElement | null)[]>(Array(groupCount).fill(null));

  // Navigation buttons for header
  const navButtons = (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: groupCount }).map((_, i) => (
        <button
          key={i}
          aria-label={`Show group ${i + 1}`}
          style={{
            background: i === currentGroup ? COLORS.primary : COLORS.elevation4,
            color: i === currentGroup ? COLORS.textSecondary : COLORS.text,
            border: `1px solid ${COLORS.primaryBorder}`,
            borderRadius: 4,
            padding: '2px 8px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          onClick={() => setCurrentGroup(i)}
        >
          {i + 1}
        </button>
      ))}
    </div>
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

  const handleDiscordSend = async (info: any) => {
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
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8}}>
        {navButtons}
        <button
          type="button"
          className="btn-download"
          onClick={handleExportAll}
        >
          Export All as Zip
        </button>
        <button
          type="button"
          className="btn-discord"
          onClick={() => setDiscordOpen(true)}
        >
          <DiscordIcon width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Send All to Discord
        </button>
      </div>
      {discordOpen && (
        <DiscordModal
          open={discordOpen}
          onClose={() => setDiscordOpen(false)}
          onSubmit={handleDiscordSend}
        />
      )}
      {discordStatus && (
        <div style={{ color: discordStatus.startsWith('Posted') ? COLORS.success : COLORS.error, fontWeight: 600, margin: '10px 0' }}>{discordStatus}</div>
      )}
      {/* Render all panels, but only show the current one. Others are hidden but in DOM for export. */}
      {Array.from({ length: groupCount }).map((_, i) => (
        <div
          key={i}
          ref={el => (panelRefs.current[i] = el)}
          style={{ display: i === currentGroup ? 'block' : 'none' }}
        >
          <SinglePanelLayout
            header={getPanelHeader(i)}
            panelRef={{ current: panelRefs.current[i] }}
            height='85vh'
          >
            {children ? children(i, { disableAnimation: exporting }) : null}
          </SinglePanelLayout>
        </div>
      ))}
    </div>
  );
}
