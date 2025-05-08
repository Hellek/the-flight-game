import React from 'react'

interface PanelHeaderProps {
  title: string;
  onClose: () => void;
}

export const PanelHeader: React.FC<PanelHeaderProps> = ({ title, onClose }) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 border-b border-slate-200">
    <h3 className="text-lg font-semibold text-slate-800">
      {title}
    </h3>
    <button
      onClick={onClose}
      className="p-1 hover:bg-slate-200 rounded-full transition-colors"
    >
      <svg
        className="w-5 h-5 text-slate-500"
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
    </button>
  </div>
)
