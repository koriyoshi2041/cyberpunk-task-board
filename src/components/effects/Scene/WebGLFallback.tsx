import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class WebGLFallback extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("WebGL 3D Background failed to load:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="absolute inset-0 flex items-center justify-center p-8 pointer-events-none opacity-50 z-0">
                    <div className="text-center p-6 border rounded-xl glass-card">
                        <h3 className="text-lg font-bold mb-2">3D Background Disabled</h3>
                        <p className="text-sm">
                            Your browser environment does not support WebGL or hardware acceleration is restricted (Sandboxing).<br />
                            The 3D Cyberpunk models cannot be rendered here.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
