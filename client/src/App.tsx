import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./App.scss";
import SphereVisualizer from "./components/webgl/SphereVisualizer";
import PlaneVisualizer from "./components/webgl/PlaneVisualizer";
import CylinderVisualizer from "./components/webgl/CylinderVisualizer";
import FractalVisualizer from "./components/webgl/FractalVisualizer";
import TorusVisualizer from "./components/webgl/TorusVisualizer";
import { TornadoVisualizer } from "./components/webgl/TornadoVisualizer";
import { Audio, Scene } from "./models/types";
import Sphere from "./components/webgl/Sphere";
import { Button, InputLabel, MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import AudioContainer from "./components/parameters/AudioContainer";
import AudioActionsContainer from "./components/parameters/AudioActionsContainer";


let initialScenes: Scene[] = [
  {
    name: "sphere",
    jsx: SphereVisualizer,
    selected: false,
    detailLevel: 64,
    cameraPos: new THREE.Vector3(0, -37.5, 112.5),

  },
  {
    name: "newSphere",
    jsx: Sphere,
    selected: false,
    detailLevel: 64,
    cameraPos: new THREE.Vector3(0, -37.5, 112.5),

  },
  {
    name: "plane",
    jsx: PlaneVisualizer,
    selected: false,
    detailLevel: 64,
    cameraPos: new THREE.Vector3(0, 0, 0)
  },
  {
    name: "fractal",
    jsx: FractalVisualizer,
    selected: false,
    detailLevel: 64,
    cameraPos: new THREE.Vector3(0, 0, 0)
  },
  {
    name: "cylinder",
    jsx: CylinderVisualizer,
    selected: false,
    detailLevel: 64,
    cameraPos: new THREE.Vector3(0, 0, 0)
  },
  {
    name: "torus",
    jsx: TorusVisualizer,
    selected: false,
    detailLevel: 64,
    cameraPos: new THREE.Vector3(0, 0, 0)
  },
  {
    name: "tornado",
    jsx: TornadoVisualizer,
    selected: false,
    detailLevel: 64,
    cameraPos: new THREE.Vector3(0, 0, 0)
  },
];

const WebGLCanvas = ( { selectedScene }: { selectedScene: Scene | undefined; } ) => {

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
          gl={{ alpha: false }}
          onCreated={({ gl, scene }) => {
            gl.outputEncoding = THREE.sRGBEncoding;
            
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

            {/* <EffectComposer>
              <Bloom luminanceThreshold={0.0} intensity={1.5} luminanceSmoothing={0.5} />  
            </EffectComposer>  */}
            
          <ambientLight intensity={1.0} />
          <OrbitControls />
        </Canvas>
      </Suspense>
    </>
  );
};


function App() {
  const [scenes, setScenes] = useState(initialScenes);
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>(undefined);
  const [selectedDetailLevel, setSelectedDetailLevel] = useState<string>('high');
  const [isScrolling, setIsScrolling] = useState(false);

  const [currentAudio, setCurrentAudio] = useState<Audio | undefined>(undefined);
  const [isAudioAndInputsContainerVisible, setIsAudioAndInputsContainerVisible] = useState(true);

  const visualizerContainer = useRef<HTMLDivElement | null>(null);
  const canvasHolderRef = useRef<HTMLDivElement | null>(null);
  const audioAndInputsContainerRef = useRef<HTMLDivElement | null>(null);

  const detailMap = new Map<String, number>();
  detailMap.set("low", 16);
  detailMap.set("medium", 32);
  detailMap.set("high", 64);
  detailMap.set("ultra", 128);

  const switchSelected = (sceneName: string) => {

    const currentScene = initialScenes.find((scene) => scene.name === sceneName);
    currentScene!.detailLevel = detailMap.get(selectedDetailLevel) || 32;
    setSelectedScene(currentScene);

  };

  const handleSetSceneNull = () => {
    setSelectedScene(undefined);
  }

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value;
    setSelectedDetailLevel(newValue);
  };

  const handleRightDirection = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (isScrolling) return;

    setIsScrolling(true);
    e.stopPropagation();

    const gap = 80; // 5rem => 16 * 5

    const container = visualizerContainer.current;
    if (container) {
      const width = container.clientWidth;  // or clientWidth, depending on your needs
      container.scroll({
        behavior: 'smooth',
        left: container.scrollLeft + width + gap,
      });
    }

    setTimeout(() => {
      setIsScrolling(false);
    }, 700);
  };

  const handleLeftDirection = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (isScrolling) return;

    setIsScrolling(true);
    e.stopPropagation();
    const gap = 80;

    const container = visualizerContainer.current;

  if (container) {
    const width = container.clientWidth;  // or clientWidth, depending on your needs
      container.scroll({
        behavior: 'smooth',
        left: container.scrollLeft - width - gap,
      });
  }

  setTimeout(() => {
    setIsScrolling(false);
  }, 700);

  };

  const handleSelectAudio = (audio: Audio | undefined) => {
    setCurrentAudio(audio);
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'n') {
      // setIsAudioAndInputsContainerVisible(prevState => !prevState);
      audioAndInputsContainerRef.current?.classList.toggle('hidden')
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  return (
    <div className="App">
      <nav className="navBar"></nav>
      <main className="mainSection">
        { !selectedScene ? 
        <div className="wrapper">
          <KeyboardDoubleArrowRightIcon onClick={(e) => handleRightDirection(e)} className="rightIcon" />
          <KeyboardDoubleArrowLeftIcon onClick={(e) => handleLeftDirection(e)} className="leftIcon" />
          <div ref={visualizerContainer} className="visualizerContainer">
            {  scenes.map((scene) => (
              <div
                key={scene.name}
                className="visualizerElement"
              >
                <h2>{scene.name}</h2>
                <FormControl >
                  <InputLabel id="demo-simple-select-label">Age</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select" 
                    key={scene.name}
                    value={selectedDetailLevel} 
                    onChange={handleSelectChange}
                    label="Geometry detail level"
                    fullWidth={true}
                  >
                    <MenuItem value={"low"}>low res</MenuItem>
                    <MenuItem value={"medium"}>medium res</MenuItem> 
                    <MenuItem value={"high"}>high res</MenuItem>
                    <MenuItem value={"ultra"}>ultra res</MenuItem>
                  </Select>
                </FormControl>
                <Button variant="outlined" onClick={() => switchSelected(scene.name)}>Select</Button>
              </div>
            ))}
            </div>
          </div> 
          :
        <div ref={canvasHolderRef} className="canvasHolder">
          <WebGLCanvas selectedScene={selectedScene}  />
        </div>
        }

      
      {  selectedScene ? 
        <div 
        //style={{ opacity: isAudioAndInputsContainerVisible ? 0 : 1 }}
        ref={audioAndInputsContainerRef}
        className="audioAndInputsContainer">
          <AudioContainer handleSetSceneNull={handleSetSceneNull} currentAudio={currentAudio} />
          <AudioActionsContainer handleSelectAudio={handleSelectAudio} />
        </div> : null
       } 
      </main>    

    </div>
  );
}

export default App;
