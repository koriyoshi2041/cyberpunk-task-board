import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function FloatingDust({ count = 800 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null)

    // Pre-calculate positions, rotations, and scales for the dust particles
    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < count; i++) {
            temp.push({
                // Random positions inside a wide cylinder/box area
                position: new THREE.Vector3(
                    (Math.random() - 0.5) * 40,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 20 - 5
                ),
                // Random rotation
                rotation: new THREE.Euler(
                    Math.random() * Math.PI,
                    Math.random() * Math.PI,
                    Math.random() * Math.PI
                ),
                // Random scale (tiny dust)
                scale: new THREE.Vector3().setScalar(0.1 + Math.random() * 0.3),
                // Individual speed multiplier
                speed: 0.2 + Math.random(),
                // Offset for sine wave movements
                offset: Math.random() * 100,
            })
        }
        return temp
    }, [count])

    // Dummy object to help calculate matrix for instanced rendering
    const dummy = useMemo(() => new THREE.Object3D(), [])

    useFrame((state) => {
        if (!meshRef.current) return

        const time = state.clock.elapsedTime

        // Add subtle interactivity based on mouse position
        const mouseX = (state.pointer.x * Math.PI) / 10
        const mouseY = (state.pointer.y * Math.PI) / 10

        particles.forEach((particle, i) => {
            // Drift upwards slowly
            let y = particle.position.y + time * 0.4 * particle.speed

            // Wrap around if it goes too high
            if (y > 10) {
                y = -10
                particle.position.y = y - time * 0.4 * particle.speed // reset base position to avoid snapping jump
            }

            // Add gentle swaying
            const x = particle.position.x + Math.sin(time * 0.5 + particle.offset) * 0.2
            const z = particle.position.z + Math.cos(time * 0.4 + particle.offset) * 0.2

            dummy.position.set(x + mouseX, y, z - Math.abs(mouseY))

            // Rotate the particle itself
            dummy.rotation.x = particle.rotation.x + time * particle.speed * 0.5
            dummy.rotation.y = particle.rotation.y + time * particle.speed * 0.3
            dummy.rotation.z = particle.rotation.z + time * particle.speed * 0.2

            dummy.scale.copy(particle.scale)
            dummy.updateMatrix()

            meshRef.current!.setMatrixAt(i, dummy.matrix)
        })

        meshRef.current.instanceMatrix.needsUpdate = true
    })

    // Using a subtle purple/blue emissive material for the "data dust"
    return (
        <instancedMesh ref={meshRef} args={[null as any, null as any, count]}>
            <dodecahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
                color="#8A2BE2"
                emissive="#4169E1"
                emissiveIntensity={0.8}
                roughness={0.2}
                metalness={0.8}
                transparent={true}
                opacity={0.3}
            />
        </instancedMesh>
    )
}
