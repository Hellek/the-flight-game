import * as THREE from 'three';

interface DebugPlanesProps {
  size?: number;
}

export const DebugPlanes = ({ size = 0.1 }: DebugPlanesProps) => {
  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color="#00ff00"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color="#0080ff"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[size, size]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
