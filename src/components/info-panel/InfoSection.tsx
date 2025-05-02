import React from 'react';

interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

export const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-blue-500" />
      <h4 className="text-lg font-medium text-slate-800">{title}</h4>
    </div>
    <div className="pl-4 text-sm text-slate-600">
      {children}
    </div>
  </div>
);
