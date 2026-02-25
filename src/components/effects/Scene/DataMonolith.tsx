import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function DataMonolith() {
    const outerRef = useRef<THREE.Mesh>(null)
    const innerRef = useRef<THREE.Mesh>(null)
    const coreRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const time = state.clock.elapsedTime
        if (outerRef.current) {
            outerRef.current.rotation.x = time * 0.1
            outerRef.current.rotation.y = time * 0.15
        }
        if (innerRef.current) {
            innerRef.current.rotation.x = -time * 0.2
            innerRef.current.rotation.y = -time * 0.1
        }
        if (coreRef.current) {
            coreRef.current.rotation.y = time * 0.5
            // Pulsing effect
            coreRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.1)
        }
    })

    return (
        <group position={[4, 0, -5]}> {/* Brought closer to camera so it's clearly visible */}
            {/* Outer Wireframe Torus Knot */}
            <mesh ref={outerRef}>
                <torusKnotGeometry args={[4, 0.8, 128, 32]} />
                <meshStandardMaterial
                    color="#050510"
                    wireframe={true}
                    transparent={true}
                    opacity={0.4}
                    emissive="#B5179E"
                    emissiveIntensity={1.5}
                />
            </mesh>

            {/* Inner Glass Icosahedron */}
            <mesh ref={innerRef}>
                <icosahedronGeometry args={[2.5, 1]} />
                <meshPhysicalMaterial
                    color="#4361EE"
                    metalness={0.9}
                    roughness={0.1}
                    envMapIntensity={1.0}
                    clearcoat={1.0}
                    clearcoatRoughness={0.1}
                    transparent={true}
                    opacity={0.6}
                    wireframe={true}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Glowing Core */}
            <mesh ref={coreRef}>
                <octahedronGeometry args={[1.5, 0]} />
                <meshStandardMaterial
                    color="#FF3366"
                    emissive="#FF3366"
                    emissiveIntensity={2}
                    toneMapped={false}
                />
            </mesh>
        </group>
    )
}
