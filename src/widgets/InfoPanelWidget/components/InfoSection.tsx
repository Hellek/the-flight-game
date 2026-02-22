import type { ReactNode } from 'react';
import { Heading } from '@components/ui';

interface InfoSectionProps {
  title: string;
  children: ReactNode;
}

export const InfoSection = ({ title, children }: InfoSectionProps) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <div className="size-2 rounded-full bg-blue-500" />
      <Heading level={4}>{title}</Heading>
    </div>
    <div className="pl-4 text-sm text-slate-600">
      {children}
    </div>
  </div>
);
