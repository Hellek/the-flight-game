import { Button, Heading } from '@components/ui';

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

export const PanelHeader = ({ title, onClose }: PanelHeaderProps) => (
  <div className="
    flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4
  ">
    <Heading level={3}>{title}</Heading>
    <Button variant="icon" onClick={onClose} aria-label="Закрыть">
      <svg
        className="size-5 text-slate-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </Button>
  </div>
);
