import { GameControls } from '@components/GameControls'
import { GlobeSphere } from '@components/GlobeSphere'
import { InfoPanel } from '@components/InfoPanel'
import { Canvas } from '@react-three/fiber'

export const Game = () => {
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
