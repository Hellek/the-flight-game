import type { ReactNode } from 'react';
import { DEBUG } from '@constants';
import { DebugPlanes } from './DebugPlanes';

interface DebugWrapperProps {
  children?: ReactNode;
  size?: number;
}

export const DebugWrapper = ({ children, size }: DebugWrapperProps) => {
  if (!DEBUG.ENABLED || !DEBUG.SHOW_PLANES) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <DebugPlanes size={size ?? DEBUG.PLANES_SIZE} />
    </>
  );
};
