import { ExtrudeGeometry, Shape } from 'three';

interface WingsProps {
  color?: string
}

const createWingShape = () => {
  const shape = new Shape();

  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.4, 0.15, 0.8, 0.15, 1, 0);
  shape.bezierCurveTo(0.8, -0.05, 0.4, -0.05, 0, 0);

  return shape;
};

const wingExtrudeSettings = {
  steps: 1,
  depth: 4,
  bevelEnabled: true,
  bevelThickness: 0.05,
  bevelSize: 0.05,
  bevelSegments: 3,
};

const wingGeometry = new ExtrudeGeometry(createWingShape(), wingExtrudeSettings);

export function Wings({ color }: WingsProps) {
  return (
    <group>
      <mesh
        position={[0, 0, -0.25]}
        rotation={[Math.PI / 2, Math.PI / 2, Math.PI * 0.5]}
      >
        <primitive object={wingGeometry} />
        {color && <meshBasicMaterial color={color} />}
      </mesh>

      <mesh
        position={[-4, 0, -0.25]}
        rotation={[Math.PI / 2, Math.PI / 2, Math.PI * 0.5]}
      >
        <primitive object={wingGeometry} />
        {color && <meshBasicMaterial color={color} />}
      </mesh>
    </group>
  );
}
