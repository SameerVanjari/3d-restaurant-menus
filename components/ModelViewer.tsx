import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Center, useGLTF } from '@react-three/drei';
import { XR, ARButton, useXR, createXRStore } from '@react-three/xr';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

const ModelViewer = ({ modelPath, scale, arMode, onExit }: { modelPath: string; scale?: number; arMode?: boolean; onExit?: () => void }) => {
    const { scene } = useGLTF(modelPath);
    const [autoScale, setAutoScale] = useState(1);
    const store = createXRStore();

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            // Fit to canvas height 400px, with 80% fill
            const fitScale = (8 * 0.8) / maxDim;
            setAutoScale(fitScale);
        }
    }, [scene]);

    useEffect(() => {
        if (arMode) {
            const unsubscribe = store.subscribe((state) => {
                if (!state.session) {
                    onExit?.();
                }
            });
            return unsubscribe;
        }
    }, [store, arMode, onExit]);

    // // Clean up geometry & materials on unmount to avoid memory leaks
    // useEffect(() => {
    //     return () => {
    //         scene.traverse((obj: THREE.Object3D) => {
    //             if ((obj as THREE.Mesh).geometry) {
    //                 (obj as THREE.Mesh).geometry.dispose();
    //             }
    //             if ((obj as THREE.Mesh).material) {
    //                 const materials = Array.isArray((obj as THREE.Mesh).material)
    //                     ? (obj as THREE.Mesh).material
    //                     : [(obj as THREE.Mesh).material];
    //                 (materials as any).forEach((m: any) => m.dispose && m.dispose());
    //             }
    //         });
    //     };
    // }, [scene]);

    // Clear GLTF cache on unmount
    useEffect(() => {
        return () => {
            useGLTF.clear(modelPath);
        };
    }, [modelPath]);

    if (arMode) {
        return (
            <div className="fixed inset-0 z-50 bg-black">
                <ARButton store={store} />
                <Canvas
                    style={{ height: '100vh', width: '100vw' }}
                    gl={{ antialias: true, powerPreference: 'high-performance' }}
                    dpr={[1, 1.5]}
                >
                    <XR store={store}>
                        <ambientLight intensity={0.4} />
                        <directionalLight
                            position={[5, 10, 5]}
                            intensity={1}
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                        />
                        <pointLight position={[-5, 5, -5]} intensity={0.6} />
                        <spotLight position={[0, 8, 10]} angle={0.3} intensity={0.8} />

                        <Environment preset="apartment" />

                        <Center>
                            <primitive object={scene} scale={scale || autoScale} />
                        </Center>
                    </XR>
                </Canvas>
            </div>
        );
    }

    return (
        <Canvas
            style={{ height: 400, width: '100%' }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
            className='cursor-grab active:cursor-grabbing'
        >
            <ambientLight intensity={0.4} />
            <directionalLight
                position={[5, 10, 5]}
                intensity={1}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
            />
            <pointLight position={[-5, 5, -5]} intensity={0.6} />
            <spotLight position={[0, 8, 10]} angle={0.3} intensity={0.8} />

            <Environment preset="apartment" />

            <Center>
                <primitive object={scene} scale={scale || autoScale} />
            </Center>

            <OrbitControls
                enablePan={false}
                enableZoom={true}
                minPolarAngle={Math.PI / 3}
                maxPolarAngle={Math.PI / 3}
            />
        </Canvas>
    );
};

export default ModelViewer;
