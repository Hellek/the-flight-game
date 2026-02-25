import { useCallback, useEffect, useState } from 'react';

function getFullscreenElement(): Element | null {
  return (
    document.fullscreenElement ??
    (document as Document & { webkitFullscreenElement?: Element }).webkitFullscreenElement ??
    null
  );
}

function requestFullscreen(el: Element): Promise<void> {
  const doc = el as Element & {
    requestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
    msRequestFullscreen?: () => Promise<void>;
  };

  if (doc.requestFullscreen) return doc.requestFullscreen();
  if (doc.webkitRequestFullscreen) return doc.webkitRequestFullscreen();
  if (doc.msRequestFullscreen) return doc.msRequestFullscreen();
  return Promise.reject(new Error('Fullscreen is not supported'));
}

function exitFullscreen(): Promise<void> {
  const doc = document as Document & {
    exitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
  };

  if (doc.exitFullscreen) return doc.exitFullscreen();
  if (doc.webkitExitFullscreen) return doc.webkitExitFullscreen();
  if (doc.msExitFullscreen) return doc.msExitFullscreen();
  return Promise.reject(new Error('Fullscreen is not supported'));
}

export function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(() => !!getFullscreenElement());

  const toggle = useCallback(() => {
    const el = getFullscreenElement();
    if (el) {
      exitFullscreen().catch(() => { });
    } else {
      requestFullscreen(document.documentElement).catch(() => { });
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!getFullscreenElement());
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    document.addEventListener('msfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
      document.removeEventListener('msfullscreenchange', handler);
    };
  }, []);

  const docEl =
    typeof document !== 'undefined'
      ? (document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => void;
      })
      : null;

  const supported =
    !!docEl && !!(docEl.requestFullscreen ?? docEl.webkitRequestFullscreen);

  return { isFullscreen, toggle, supported };
}
