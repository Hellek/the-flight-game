import type { ReactNode } from 'react';

/**
 * Отступы по safe-area insets: учитывают вырезы экрана, «островки» и системные
 * зоны (статус-бар, домашний индикатор) на iOS и других устройствах, чтобы
 * контент не заходил под них. CSS-переменные задаются браузером/окружением.
 */
const safeAreaPaddingStyle: React.CSSProperties = {
  paddingTop: 'var(--safe-area-inset-top)',
  paddingRight: 'var(--safe-area-inset-right)',
  paddingBottom: 'var(--safe-area-inset-bottom)',
  paddingLeft: 'var(--safe-area-inset-left)',
};

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div
      className="flex h-screen flex-col select-none"
      style={safeAreaPaddingStyle}
    >
      {children}
    </div>
  );
}
