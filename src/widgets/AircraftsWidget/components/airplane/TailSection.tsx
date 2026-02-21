import { ExtrudeGeometry, Shape } from 'three';

interface TailSectionProps {
  color?: string
}

const createHorizontalStabilizerShape = () => {
  const shape = new Shape();

  shape.moveTo(0, 0);
  shape.bezierCurveTo(0.3, 0.1, 0.6, 0.1, 0.8, 0);
  shape.bezierCurveTo(0.6, -0.03, 0.3, -0.03, 0, 0);

  return shape;
};

const horizontalStabilizerSettings = {
  steps: 1,
  depth: 2,
  bevelEnabled: true,
  bevelThickness: 0.02,
  bevelSize: 0.02,
  bevelSegments: 3,
};

const horizontalStabilizerGeometry = new ExtrudeGeometry(
  createHorizontalStabilizerShape(),
  horizontalStabilizerSettings,
);

export function TailSection({ color }: TailSectionProps) {
  return (
    <group position={[0, 0, -3.5]}>
      <group position={[0, 0, 0]}>
        <mesh
          position={[0, 0, 0.7]}
          rotation={[Math.PI / 2, Math.PI / 2, Math.PI * 0.5]}
        >
          <primitive object={horizontalStabilizerGeometry} />
          {color && <meshBasicMaterial color={color} />}
        </mesh>

        <mesh
          position={[-2.0, 0, 0.7]}
          rotation={[Math.PI / 2, Math.PI / 2, Math.PI * 0.5]}
        >
          <primitive object={horizontalStabilizerGeometry} />
          {color && <meshBasicMaterial color={color} />}
        </mesh>
      </group>
    </group>
  );
}
