import { COLORS } from "./colors";

interface ChartFooterProps {
    text: string;
}
export function ChartFooter({ text }: ChartFooterProps) {
    return (
        <footer aria-label="Chart footer" style={{ textAlign: 'left', fontSize: 10, color: COLORS.text, margin: '0 0 5px 16px' }}>
            {text}
        </footer>
    );
}