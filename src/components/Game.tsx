import React from 'react';
import { World } from './World';

export const Game: React.FC = () => {
  return (
    <div className="w-full h-screen">
      <div className="w-full h-full">
        <World />
      </div>
    </div>
  );
};
