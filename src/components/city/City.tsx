import React, { useState, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import * as THREE from 'three'
import { type ThreeEvent } from '@react-three/fiber'

import { Circle } from '@react-three/drei'
import { itemColor, itemColorHovered, itemColorSelected } from '../../constants'
import { CITY } from '../../constants'
import { rootStore } from '../../stores'
import { City as CityType } from '../../types'

interface CityProps {
  city: CityType
}

export const City: React.FC<CityProps> = observer(({ city }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { selectedEntity } = rootStore.selection

  const isSelected = selectedEntity?.type === 'city' &&
    selectedEntity.data.iata === city.iata

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    rootStore.selection.selectCity(city)
  }, [city])

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
    setIsHovered(true)
  }

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    document.body.style.cursor = 'auto'
    setIsHovered(false)
  }

  const color = isSelected ? itemColorSelected : isHovered ? itemColorHovered : itemColor
  const position = [city.position.x, city.position.y, city.position.z] as [number, number, number]

  // Вычисляем нормаль поверхности в точке города
  const normal = new THREE.Vector3(city.position.x, city.position.y, city.position.z).normalize()

  // Вычисляем поворот для ориентации круга перпендикулярно нормали
  const up = new THREE.Vector3(0, 1, 0)
  const rotationMatrix = new THREE.Matrix4()
  rotationMatrix.lookAt(new THREE.Vector3(0, 0, 0), normal, up)
  const quaternion = new THREE.Quaternion()
  quaternion.setFromRotationMatrix(rotationMatrix)
  const euler = new THREE.Euler()
  euler.setFromQuaternion(quaternion)

  // Разворачиваем на 180 градусов, чтобы лицевая сторона смотрела от центра
  euler.y += Math.PI

  return (
    <Circle
      args={[CITY.SIZE, 16]}
      position={position}
      rotation={[euler.x, euler.y, euler.z]}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <meshBasicMaterial color={color} />
    </Circle>
  )
})
