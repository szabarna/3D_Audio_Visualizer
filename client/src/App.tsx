import React, { useEffect, useRef, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import * as THREE from "three";
import "./App.scss";
import SphereVisualizer from "./components/webgl/SphereVisualizer";
import PlaneVisualizer from "./components/webgl/PlaneVisualizer";
import CylinderVisualizer from "./components/webgl/CylinderVisualizer";
import FractalVisualizer from "./components/webgl/FractalVisualizer";
import TorusVisualizer from "./components/webgl/TorusVisualizer";
import { TornadoVisualizer } from "./components/webgl/TornadoVisualizer";
import { PlaylistWithBuffer, Scene, TrackWithBuffer } from "./models/types";
import { Sphere } from "./components/webgl/Sphere";
import { Button, InputLabel, MenuItem } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AudioFileOutlinedIcon from '@mui/icons-material/AudioFileOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

import AudioContainer from "./components/parameters/AudioContainer";
import AudioActionsContainer from "./components/parameters/AudioActionsContainer";
import { CreatePlaylistComponent } from "./components/main/CreatePlaylistComponent";
import { CurrentPlaylistComponent } from "./components/main/CurrentPlaylistComponent";
import { AddTrackComponent } from "./components/main/AddTrackComponent";
import { SearchComponent } from "./components/main/SearchComponent";
import { WebGLCanvas } from "./components/webgl/WebGLCanvas";
import { LoginComponent } from "./components/auth/Login";
import { RegisterComponent } from "./components/auth/Register";

import { initializeApp } from "firebase/app";
import firebaseConfig from './firebase';

enum DetailLevel {
  Low = "low",
  Medium = "medium",
  High = "high",
  Ultra = "ultra",
  Extreme = 'extreme'
}

const DETAIL_MAP: Record<DetailLevel, number> = {
  [DetailLevel.Low]: 16,
  [DetailLevel.Medium]: 32,
  [DetailLevel.High]: 64,
  [DetailLevel.Ultra]: 128,
  [DetailLevel.Extreme]: 164,
}

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
    cameraPos: new THREE.Vector3(0, -37.5, 75.5),
    // cameraPos: new THREE.Vector3(0, -37.5, 75.5),

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
    cameraPos: new THREE.Vector3(0, 0, 75.5)
  },
  {
    name: "tornado",
    jsx: TornadoVisualizer,
    selected: false,
    detailLevel: 64,
    cameraPos: new THREE.Vector3(0, 0, 0)
  },
];


function App() {

  const app =  initializeApp(firebaseConfig);
 
  const [selectedScene, setSelectedScene] = useState<Scene | undefined>(undefined);
  const [selectedDetailLevel, setSelectedDetailLevel] = useState<DetailLevel>(DetailLevel.High);
  const [isScrolling, setIsScrolling] = useState(false);

  const [mainVisible, setMainVisible] = useState<boolean>(false);
  const [isCreatePlaylist, setIsCreatePlaylist] = useState<boolean>(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<PlaylistWithBuffer | null>(null);
  const [isCreateTrack, setIsCreateTrack] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  const [currentTrack, setCurrentTrack] = useState<TrackWithBuffer | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [sampleRate, setSampleRate] = useState<number>(0);
  const [currentAudioElement, setCurrentAudioElement] = useState<HTMLAudioElement | null>(null);

  const scenes = useRef<Scene[]>(initialScenes);
  const visualizerContainer = useRef<HTMLDivElement | null>(null);
  const canvasHolderRef = useRef<HTMLDivElement | null>(null);
  const audioAndInputsContainerRef = useRef<HTMLDivElement | null>(null);


  const handleCurrentAnalyser = (analyser: AnalyserNode, sampleRate: number, audioElement: HTMLAudioElement | null) => {
      setAnalyser(analyser);
      setSampleRate(sampleRate);
      setCurrentAudioElement(audioElement);
  }

  const handleCurrentTrack = (currentTrack: TrackWithBuffer) => {
    setCurrentTrack(currentTrack);
    localStorage.setItem('current_track', JSON.stringify(currentTrack));

  };

  const switchSelected = (sceneName: string) => {
    const currentScene = initialScenes.find((scene) => scene.name === sceneName);
    if(!currentScene) return;
    currentScene.detailLevel = DETAIL_MAP[selectedDetailLevel];
    setSelectedScene(currentScene);

  };

  const handleSetSceneNull = () => {
    setSelectedScene(undefined);
  }

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const newValue = event.target.value as DetailLevel; 
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

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Numpad0') {
      audioAndInputsContainerRef.current?.classList.toggle('hidden')
    }
  };

  const handleOpenCreatePlaylist = () => {
    setMainVisible(true);
    setIsCreateTrack(false);
    setCurrentPlaylist(null);
    setIsSearch(false);

    setIsCreatePlaylist(true);
  };

  const handleOpenPlaylist = (playlist: PlaylistWithBuffer) => {
    setMainVisible(true);
    setIsCreatePlaylist(false);
    setIsCreateTrack(false);
    setIsSearch(false);

    setCurrentPlaylist(playlist);
  };

  const handleOpenAddTrack = () => {
    setMainVisible(true);
    setIsCreatePlaylist(false);
    setCurrentPlaylist(null);
    setIsSearch(false);

    setIsCreateTrack(true);
  };

  const handleOpenSearch = () => {
    setMainVisible(true);
    setIsCreatePlaylist(false);
    setCurrentPlaylist(null);
    setIsCreateTrack(false);

    setIsSearch(true);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    if(!currentTrack) {
      const stringCurrentTrack = localStorage.getItem('current_track')
      if(stringCurrentTrack){ 
        console.log(JSON.parse(stringCurrentTrack))
        setCurrentTrack(JSON.parse(stringCurrentTrack)); 
      }
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentTrack]);


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index path='/login' element={ <LoginComponent /> } />
          <Route path='/register' element={ <RegisterComponent /> } />
          <Route path='/main' element={  
          <main className="mainSection">
            <nav className="navBar"></nav>
            { !selectedScene ? 
            <div className="wrapper">
              <KeyboardDoubleArrowRightIcon onClick={(e) => handleRightDirection(e)} className="rightIcon" />
              <KeyboardDoubleArrowLeftIcon onClick={(e) => handleLeftDirection(e)} className="leftIcon" />
              <div ref={visualizerContainer} className="visualizerContainer">
                {  scenes.current.map((scene) => (
                  <div
                    key={scene.name}
                    className="visualizerElement"
                  >
                    <h2>{scene.name}</h2>
                    <FormControl >
                      <InputLabel id="demo-simple-select-label">Detail Level</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select" 
                        key={scene.name}
                        value={selectedDetailLevel} 
                        onChange={handleSelectChange}
                        label="Geometry detail level"
                        fullWidth={true}
                      >
                        <MenuItem value={"low"}>Low resolution</MenuItem>
                        <MenuItem value={"medium"}>Medium resolution</MenuItem> 
                        <MenuItem value={"high"}>High resolution</MenuItem>
                        <MenuItem value={"ultra"}>Ultra resolution</MenuItem>
                        <MenuItem value={"extreme"}>Extreme resolution</MenuItem>
                      </Select>
                    </FormControl>
                    <Button variant="outlined" onClick={() => switchSelected(scene.name)}>Select</Button>
                  </div>
                ))}
                </div>
              </div> 
              :
            <div ref={canvasHolderRef} className="canvasHolder">
              <WebGLCanvas currentAudioElement={currentAudioElement} sampleRate={sampleRate} analyser={analyser} selectedScene={selectedScene}  />
            </div>
            }

          {  selectedScene ? 
            <div 
            ref={audioAndInputsContainerRef}
            className="audioAndInputsContainer">
              <AudioContainer handleCurrentAnalyser={handleCurrentAnalyser} handleSetSceneNull={handleSetSceneNull} currentTrack={currentTrack} />
              <div className="componentContainerDiv" style={ !mainVisible ? { justifyContent: 'space-between', gridTemplateColumns: '20% 20%', padding: '0 0.225rem' } : {} } >
                <div className="mainActionsContainer">
                  <div className="topActionsContainer">
                    <div className="topActionDiv" onClick={() => setMainVisible(false)}><HomeOutlinedIcon /><h2>Home</h2></div>
                    <div className="topActionDiv" onClick={handleOpenAddTrack}><AudioFileOutlinedIcon /><h2>Add Track</h2></div>
                    <div className="topActionDiv" onClick={handleOpenSearch}><SearchOutlinedIcon /><h2>Search</h2></div>
                  </div>
                  <AudioActionsContainer currentPlaylistId={currentPlaylist?.id} handleOpenPlaylist={handleOpenPlaylist} handleOpenCreatePlaylist={handleOpenCreatePlaylist} />
                </div>
                { mainVisible ? 
                  <div className="mainModalDiv">
                    <div className="exitModalButton" onClick={() => setMainVisible(false) }>
                      <span>&#10005;</span>
                    </div>
                    <AddTrackComponent isVisible={isCreateTrack} />
                    <CreatePlaylistComponent isVisible={isCreatePlaylist} />
                    <CurrentPlaylistComponent currentPlaylist={currentPlaylist} />
                    <SearchComponent handleCurrentTrack={handleCurrentTrack} isVisible={isSearch} />
                  </div> : null
                }
                <div className="parameterContainerDiv">
                  
                </div>
              </div>
            </div> : null
          } 
          </main>    } 
          />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
