import React from 'react'
import { Canvas } from '@react-three/fiber'
import { GlobeSphere } from './GlobeSphere'
import { InfoPanel } from './InfoPanel'
import { GameControls } from './GameControls'

export const Game: React.FC = () => {
  return (
    <div className="grow w-full relative">
      <Canvas>
        <ambientLight intensity={3} />
        <GlobeSphere />
        <GameControls />
      </Canvas>
      <InfoPanel />
    </div>
  )
}
