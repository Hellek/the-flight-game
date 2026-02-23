import { observer } from 'mobx-react-lite';
import { PanelHeader } from './PanelHeader';

export interface InfoPanelModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

export const InfoPanelModal = observer(function InfoPanelModal({
  title,
  children,
  onClose,
}: InfoPanelModalProps) {
  return (
    <div className="
      flex max-h-[calc(100vh-6rem)] w-80 flex-col overflow-hidden rounded-lg
      bg-white shadow-lg
    ">
      <PanelHeader title={title} onClose={onClose} />

      <div className="flex-1 space-y-3 overflow-y-auto p-4">{children}</div>
    </div>
  );
});
