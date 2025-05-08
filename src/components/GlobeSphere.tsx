import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'

import { Sphere } from '@react-three/drei'
import { continentColor, waterColor } from '../constants'
import { eurasiaCoordinates } from '../data'
import { GlobeCities } from './GlobeCities'
import { GlobeRoutes } from './GlobeRoutes'
import { createGlobeTexture } from './GlobeTexture'

export const GlobeSphere: React.FC = () => {
  const sphereRef = useRef<THREE.Mesh>(null)
  const textureQuality = 2

  const texture = useMemo(() => {
    return createGlobeTexture({
      continents: [eurasiaCoordinates],
      waterColor: waterColor,
      continentColor: continentColor,
      width: 2048 * textureQuality,
      height: 1024 * textureQuality,
    })
  }, [])

  const degree10 = Math.PI / 18

  return (
    <group>
      <Sphere
        ref={sphereRef}
        args={[1, 64, 64]}
        rotation={[Math.PI / 4, Math.PI + degree10 * 3, 0]}
      >
        <meshPhongMaterial
          map={texture}
          side={THREE.DoubleSide}
          transparent={false}
        />
      </Sphere>
      <GlobeCities />
      <GlobeRoutes />
    </group>
  )
}
