import { ReactNode, RefObject, useState } from 'react';
import { exportAsImage } from '../utils/exportAsImage';
import { DiscordModal } from '../utils/DiscordModal';
import { postToDiscordWebhook } from '../utils/discordWebhook';
import { DiscordIcon } from '../assets/DiscordIcon';

interface AnalysisPanelLayoutProps {
  header: ReactNode;
  panelRef?: RefObject<HTMLDivElement>;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  status?: ReactNode;
  actions?: ReactNode;
  exportFileName?: string;
  discordFileName?: string;
}

export function AnalysisPanelLayout({
  header,
  panelRef,
  children,
  className = '',
  style = {},
  status,
  actions,
  exportFileName = 'analysis-panel.png',
  discordFileName = 'analysis-panel.png',
}: AnalysisPanelLayoutProps) {
  const [discordOpen, setDiscordOpen] = useState(false);
  const [discordStatus, setDiscordStatus] = useState<string | null>(null);

  const handleExport = async () => {
    if (panelRef?.current) {
      await exportAsImage(panelRef.current, { fileName: exportFileName });
    }
  };

  const handleDiscordSend = async (info: any) => {
    setDiscordStatus(null);
    if (!panelRef?.current) {
      setDiscordStatus('Panel not found.');
      return;
    }
    const dataUrl = await exportAsImage(panelRef.current, { returnDataUrl: true, fileName: discordFileName }) as string;
    if (!dataUrl) {
      setDiscordStatus('Failed to export image.');
      return;
    }
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    const ok = await postToDiscordWebhook(info, info.message || '', blob, discordFileName);
    setDiscordStatus(ok ? 'Posted to Discord with image!' : 'Failed to post. Check the webhook URL and try again.');
    if (ok) setDiscordOpen(false);
  };

  return (
    <div style={{ width: '100%', ...style }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginBottom: 12 }}>
        <button
          onClick={handleExport}
          style={{
            padding: '6px 18px',
            background: '#f7b801',
            color: '#222',
            border: 'none',
            borderRadius: 4,
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Export as Image
        </button>
        <button
          type="button"
          className="analysis-discord-btn"
          onClick={() => setDiscordOpen(true)}
        >
          <DiscordIcon width={20} height={20} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Send to Discord
        </button>
        {actions}
      </div>
      {discordOpen && (
        <DiscordModal
          open={discordOpen}
          onClose={() => setDiscordOpen(false)}
          onSubmit={handleDiscordSend}
        />
      )}
      {discordStatus && (
        <div style={{ color: discordStatus.startsWith('Posted') ? '#43b581' : '#f04747', fontWeight: 600, margin: '10px 0' }}>{discordStatus}</div>
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
        }}
      >
        <h2
          style={{
            color: '#f7b801',
            fontWeight: 700,
            fontSize: '2rem',
            margin: 0,
            textAlign: 'center',
            letterSpacing: '0.01em',
            gridColumn: '1 / 13',
            gridRow: '1 / 2',
          }}
        >
          {header}
        </h2>
        {children}
      </div>
    </div>
  );
}
