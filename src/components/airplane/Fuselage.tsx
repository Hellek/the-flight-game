interface FuselageProps {
  color?: string
}

export function Fuselage({ color }: FuselageProps) {
  return (
    <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.3, 0.4, 5.8, 32]} />
      {color && <meshBasicMaterial color={color} />}
    </mesh>
  )
}
