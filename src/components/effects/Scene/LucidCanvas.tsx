import { Canvas } from '@react-three/fiber'
import { CameraControls } from '@react-three/drei'
import { Suspense, useEffect, useState } from 'react'
import { HoloGrid } from './HoloGrid'
import { FloatingDust } from './FloatingDust'
import { DataMonolith } from './DataMonolith'



function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

export function LucidCanvas() {
    const [hasWebGL, setHasWebGL] = useState(true);

    useEffect(() => {
        setHasWebGL(isWebGLAvailable());

        // Catch classic Chrome Sandbox/GPU blocklist crashes that occur asynchronously
        const handleRejection = (event: PromiseRejectionEvent) => {
            if (event.reason && event.reason.message && (event.reason.message.includes('WebGL') || event.reason.message.includes('BindToCurrentSequence'))) {
                console.warn('Caught severe WebGL crash, degrading to Pure CSS 3D Engine.');
                setHasWebGL(false);
                event.preventDefault();
            }
        };
        window.addEventListener('unhandledrejection', handleRejection);
        return () => window.removeEventListener('unhandledrejection', handleRejection);
    }, []);

    if (!hasWebGL) {
        // --- STUNNING PURE CSS FALLBACK ---
        return (
            <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(135deg,#ffffff_0%,#f5f6fa_50%,#e4e7ed_100%)]">
                {/* CSS 3D Perspective Grid */}
                <div
                    className="absolute opacity-5"
                    style={{
                        top: '-50%', left: '-50%', width: '200%', height: '200%',
                        backgroundImage: `
                            linear-gradient(to right, #00b4d8 2px, transparent 2px),
                            linear-gradient(to bottom, #9d4edd 2px, transparent 2px)
                        `,
                        backgroundSize: '80px 80px',
                        transform: 'perspective(1000px) rotateX(70deg) translateZ(-200px)',
                        animation: 'gridMove 10s linear infinite',
                        transformOrigin: 'bottom center'
                    }}
                />

                {/* Floating Holographic Orbs */}
                <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] rounded-full mix-blend-multiply opacity-20 animate-pulse"
                    style={{ background: 'radial-gradient(circle, #00b4d8 0%, transparent 70%)', filter: 'blur(80px)' }} />
                <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply opacity-15"
                    style={{ background: 'radial-gradient(circle, #9d4edd 0%, transparent 70%)', filter: 'blur(100px)', animation: 'pulse 10s infinite alternate' }} />

                <style>{`
                    @keyframes gridMove {
                        0% { transform: perspective(1000px) rotateX(70deg) translateZ(-200px) translateY(0); }
                        100% { transform: perspective(1000px) rotateX(70deg) translateZ(-200px) translateY(80px); }
                    }
                `}</style>
            </div>
        );
    }

    // --- STANDARD WEBGL 3D CANVAS ---
    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 50 }}
                dpr={[1, 2]}
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
