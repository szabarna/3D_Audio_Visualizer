import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Scene } from "../../models/types";
import { sRGBEncoding } from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

export const WebGLCanvas = ( { selectedScene }: { selectedScene: Scene | undefined; } ) => {

    const cameraPos = selectedScene?.cameraPos;
    const canvasRef = useRef<any>();
  
    return (
      <>
        <Suspense fallback={null}>
          <Canvas
            ref={canvasRef}
            className="webgl"
            camera={{
              fov: 75,
              aspect: window.innerWidth / window.innerHeight,
              near: 0.001,
              far: 1000,
              position: cameraPos ? [cameraPos.x, cameraPos.y, cameraPos.z] : [0, 0, 0],
            }}
            gl={{ alpha: false, antialias: true }} // ANTIALIAS SHOULD BE A PARAMETER
            onCreated={({ gl }) => {
              gl.outputEncoding = sRGBEncoding;
              
              gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
              gl.setSize(window.innerWidth, window.innerHeight);
            }}
          > 
            { selectedScene ? 
            
            <>
            <selectedScene.jsx detailLevel={selectedScene.detailLevel} cameraPos={cameraPos} /> 
             <Environment
              background={true} 
              files="./img/aurora_1.hdr"
              //preset={'forest'}
              scene={undefined} 
              encoding={undefined} 
              /> 
              </> : null }
  
               <EffectComposer autoClear={false}>
                    <Bloom luminanceThreshold={0.0} intensity={1.5} luminanceSmoothing={0.5} />  
               </EffectComposer>  
              
            <ambientLight intensity={1.0} />
            <OrbitControls />
          </Canvas>
        </Suspense>
      </>
    );
  };