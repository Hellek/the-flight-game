import React from 'react';
import { World } from './World';
import { generateWorld } from '../utils/worldGenerator';

export const Game: React.FC = () => {
  const world = generateWorld()
  return (
    <World world={world} />
  );
};
