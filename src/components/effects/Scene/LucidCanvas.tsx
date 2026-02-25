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
                {/* Soft, light-mode friendly fog to fade grid into distance */}
                <fog attach="fog" args={['#FAFAFC', 5, 25]} />

                {/* Lighting setup for subtle premium look */}
                <ambientLight intensity={1.2} />
                <directionalLight position={[10, 10, 5]} intensity={0.5} color="#4169E1" />
                <pointLight position={[-10, 5, -10]} intensity={1} color="#8A2BE2" />

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
            {/* 
        Optional CSS overlay to ensure the canvas blends perfectly with the very light background 
        We use a radial gradient to keep the center bright and edge slightly darker
      */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(250, 250, 252, 0.4) 100%)'
                }}
            />
        </div>
    )
}
