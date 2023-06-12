import { OrbitControls, Stars } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, GodRays, ChromaticAberration } from '@react-three/postprocessing';
import React, { Suspense, useRef, forwardRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import './App.scss';
import Visualizer from './components/webgl/Visualizer';
import SphereVisualizer from './components/webgl/SphereVisualizer';
import PlaneVisualizer from './components/webgl/PlaneVisualizer';
import CylinderVisualizer from './components/webgl/CylinderVisualizer';
import FractalVisualizer from './components/webgl/FractalVisualizer';
import TorusVisualizer from './components/webgl/TorusVisualizer';
import { TornadoVisualizer } from './components/webgl/TornadoVisualizer';

const detailLevel:number = 64;

const WebGLCanvas = (props: any) => {

  let scenes = {

      sphere: {
        name: "sphere",
        jsx: SphereVisualizer,
      },
      plane: {
        name: "plane",
        jsx: PlaneVisualizer,
      },
      fractal: {
        name: "fractal",
        jsx: FractalVisualizer,
      },
      cylinder: {
        name: "cylinder",
        jsx: CylinderVisualizer,
      },
      torus: {
        name: "torus",
        jsx: TorusVisualizer,
      },
      tornado: {
        name: "tornado",
        jsx: TornadoVisualizer,
      },

    };

    useEffect(() => {

      console.log(scenes)
      
    }, [])



  return (
    <>
    <Suspense fallback={null} >
        <Canvas
        className='webgl'
        camera={ { fov: 75, aspect: (window.innerWidth / window.innerHeight), near: 0.001, far: 1000, position: [0, 0.0, 22.5], } }
        // camera pos: position: [0, 0.1, 0.85]
        gl={{ alpha: false }}
        onCreated={({ gl, scene }) => {

          
        gl.outputEncoding = THREE.sRGBEncoding;
        gl.setPixelRatio( Math.min( window.devicePixelRatio, 2 ));
        gl.setSize( window.innerWidth, window.innerHeight );
        
        }}
        >
      
          {/* <PlaneVisualizer /> */}
           {/* <Visualizer />  */}
               <SphereVisualizer detailLevel={ detailLevel } />   
           {/* <CylinderVisualizer />   */}

             {/* <TornadoVisualizer />  */}
            {/* <FractalVisualizer /> */}

             {/* <TorusVisualizer />  */}
            
         

          <ambientLight intensity={10} />
          <OrbitControls />
        </Canvas>
    </Suspense>
    </>
  );
}

function App() {
  return (
    <div className="App">
        <WebGLCanvas />
        <div className='audioDiv'>
          <audio
          src="./audio/feelGood.mp3"
          id='audio'
          controls
          />
        </div>
    </div>
  );
}

export default App;
