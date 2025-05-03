import React from 'react';

interface WorldBackgroundProps {
  width: number;
  height: number;
}

export const WorldBackground: React.FC<WorldBackgroundProps> = ({ width, height }) => {
  return (
    <>
      {/* Фон карты */}
      <rect
        width={width}
        height={height}
        fill="#f8fafc"
      />

      {/* Сетка */}
      <pattern
        id="grid"
        width="50"
        height="50"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M 50 0 L 0 0 0 50"
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="1"
        />
      </pattern>
      <rect
        width={width}
        height={height}
        fill="url(#grid)"
      />
    </>
  );
};
