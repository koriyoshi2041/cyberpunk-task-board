import { Canvas } from '@react-three/fiber'
import { Environment, CameraControls } from '@react-three/drei'
import { Suspense } from 'react'
import { HoloGrid } from './HoloGrid'
import { FloatingDust } from './FloatingDust'
import { DataMonolith } from './DataMonolith'

export function LucidCanvas() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                dpr={[1, 2]} // Support high DPI screens
                gl={{ alpha: true, antialias: true }}
            >
                {/* Dark fog to match new background */}
                <fog attach="fog" args={['#050510', 5, 25]} />

                {/* Lighting setup for subtle premium look */}
                <ambientLight intensity={1.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.0} color="#4361EE" />
                <pointLight position={[-10, 5, -10]} intensity={2.0} color="#B5179E" />

                <Suspense fallback={null}>
                    <HoloGrid />
                    <DataMonolith />
                    <FloatingDust count={300} />
                    {/* Subtle environment map for reflections on materials */}
                    <Environment preset="city" />
                </Suspense>

                {/* Minimal interactive tilt */}
                <CameraControls
                    makeDefault
                    mouseButtons={{ left: 0, middle: 0, right: 0, wheel: 0 }} // disable direct dragging
                    touches={{ one: 0, two: 0, three: 0 }} // disable touch dragging
                    restThreshold={0.01}
                    dampingFactor={0.05}
                />
            </Canvas>
            {/* Dark vignette overlay to focus attention */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-multiply"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(5, 5, 16, 0.8) 100%)'
                }}
            />
        </div>
    )
}
