import { Canvas } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { Suspense } from 'react'
import { HoloGrid } from './HoloGrid'
import { FloatingDust } from './FloatingDust'
import { DataMonolith } from './DataMonolith'

import { WebGLFallback } from './WebGLFallback'

export function LucidCanvas() {
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <WebGLFallback>
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 50 }}
                    dpr={[1, 2]} // Support high DPI screens
                    gl={{ alpha: true, antialias: true }}
                >
                    {/* Fog to match light background */}
                    <fog attach="fog" args={['#f5f6fa', 5, 25]} />

                    {/* Studio Lighting setup since we removed Environment HDRI */}
                    <ambientLight intensity={2.5} color="#ffffff" />
                    <directionalLight position={[10, 20, 10]} intensity={1.5} color="#ffffff" />
                    <pointLight position={[-10, 10, -10]} intensity={3.0} color="#00b4d8" />
                    <pointLight position={[10, -10, 10]} intensity={2.5} color="#9d4edd" />

                    <Suspense fallback={null}>
                        <HoloGrid />
                        <DataMonolith />
                        <FloatingDust count={300} />
                        {/* Environment is INTENTIONALLY REMOVED. It caused suspense to hang due to network fetching HDRI */}
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
            </WebGLFallback>
            {/* Elegant light overlay to unify the aesthetic */}
            <div
                className="absolute inset-0 pointer-events-none mix-blend-overlay"
                style={{
                    background: 'radial-gradient(circle at center, transparent 0%, rgba(228, 231, 237, 0.4) 100%)'
                }}
            />
        </div>
    )
}
