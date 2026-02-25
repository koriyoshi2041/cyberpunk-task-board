import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function HoloGrid() {
  const gridRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (gridRef.current) {
      // Move the grid towards the camera to create infinite forward motion
      // The grid has size 200 and divisions 200, so each square is 1 unit
      // We reset every 1 unit
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 1
    }
  })

  // Bright neon grid for dark cyberpunk aesthetic
  const gridColor = new THREE.Color('#4361EE').multiplyScalar(1.5)
  const centerColor = new THREE.Color('#B5179E').multiplyScalar(2.0)

  return (
    <group ref={gridRef}>
      {/* 
        args: [size, divisions, colorCenterLine, colorGrid] 
        We make it huge so we never see the edges, and fade it into the distance using standard fog setup in canvas
      */}
      <gridHelper
        args={[200, 200, centerColor, gridColor]}
        position={[0, -2.5, 0]}
        material-transparent={true}
        material-opacity={0.3}
      />
      {/* Optional: Add a second grid slightly offset to create a richer data look */}
      <gridHelper
        args={[200, 200, gridColor, centerColor]}
        position={[0, -2.55, 0]}
        material-transparent={true}
        material-opacity={0.15}
        rotation={[0, Math.PI / 4, 0]}
      />
    </group>
  )
}
