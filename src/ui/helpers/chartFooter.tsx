import { COLORS } from "./colors";

/**
 * Props for the ChartFooter component.
 *
 * @property text - The text content to be displayed in the chart footer.
 */
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