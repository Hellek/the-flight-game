interface NoseConeProps {
  color?: string
}

export function NoseCone({ color }: NoseConeProps) {
  return (
    <group position={[0, 0, 3]}>
      <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        {color && <meshBasicMaterial color={color} />}
      </mesh>
    </group>
  )
}
