import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { Scene } from "../../models/types";
import { sRGBEncoding } from "three";
import React from "react";

export const WebGLCanvas = React.memo(( { currentAudioElement, sampleRate, analyser, selectedScene }: { currentAudioElement:HTMLAudioElement | null; sampleRate: number; analyser: AnalyserNode | null; selectedScene: Scene | undefined; } ) => {

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
            <selectedScene.jsx currentAudioElement={currentAudioElement} sampleRate={sampleRate} analyser={analyser} detailLevel={selectedScene.detailLevel} cameraPos={cameraPos} /> 
              <Environment
              background={false} 
              files="./img/aurora_1.hdr"
              //preset={'forest'}
              scene={undefined} 
              encoding={undefined}
              />  
              </> : null }
  
              
            <ambientLight intensity={1.0} />
            <OrbitControls autoRotate={ true } autoRotateSpeed={1.75} />
          </Canvas>
        </Suspense>
      </>
    );
  });