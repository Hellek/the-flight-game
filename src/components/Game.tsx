import React from 'react';
import { World } from './World';
import { generateTestWorld } from '../utils/worldGenerator';

export const Game: React.FC = () => {
  const world = generateTestWorld()
  return (
    <World world={world} />
  );
};
