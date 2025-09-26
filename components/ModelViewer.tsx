import { Canvas } from '@react-three/fiber';
import { Environment, OrbitControls, Center, useGLTF } from '@react-three/drei';
import { useEffect, useState } from 'react';
import * as THREE from 'three';

const ModelViewer = ({ modelPath, scale }: { modelPath: string; scale?: number }) => {
    const { scene } = useGLTF(modelPath);
    const [autoScale, setAutoScale] = useState(1);

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

    return (
        <Canvas
            style={{ height: 400, width: '100%' }}
            gl={{ antialias: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
            className='cursor-grab active:cursor-grabbing'
        >
            {/* Room-style lighting */}
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

            {/* Environment for reflections */}
            <Environment preset="apartment" />

            {/* Center and scale automatically */}
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
