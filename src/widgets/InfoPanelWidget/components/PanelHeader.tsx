import { X } from 'lucide-react';
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
      <X className="size-5 text-slate-500" />
    </Button>
  </div>
);
