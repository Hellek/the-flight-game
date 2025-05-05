import React from 'react';
import { World } from './World';
import { World3D } from './World3D';
import { generateWorld } from '../utils/worldGenerator';

export const Game: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const viewMode: '2d' | '3d' | null = params.get('viewMode') as '2d' | '3d' | null;
  const world = generateWorld();

  if (viewMode === '3d') {
    return <World3D world={world} />
  } else {
    return <World world={world} />
  }
};
