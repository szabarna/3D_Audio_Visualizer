import React, { useState, useEffect, useRef } from "react";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slider } from "@mui/material";
import AudioCanvas from "./AudioCanvas";
import { Audio } from "../../models/types";


let audioParams: Audio[] = [
    {
      id: '1',  
      name: "All I Know",
      audio: "allIKnow.mp3",
      artist: "AIK",
    },
    {
      id: '2',
      name: "Breaking The Habit",
      audio: "breakingTheHabit.mp3",
      artist: "BTH",
    },
    {
      id: '3',  
      name: "Dreams",
      audio: "dreams.mp3",
      artist: "DRM",
    },
    {
      id: '4',
      name: "Empty Crown",
      audio: "emptyCrown.mp3",
      artist: "EYC",
    },
    {
      id: '5',
      name: "Hero",
      audio: "hero.mp3",
      artist: "HRO",
    },
    {
      id: '6',  
      name: "Song of Storms",
      audio: "songOfStorms.mp3",
      artist: "SoS",
    },
    {
      id: '7',  
      name: "Tour",
      audio: "tour.mp3",
      artist: "TUR",
    },
    {
      id: '8',  
      name: "We wont be alone",
      audio: "weWontBeAlone.mp3",
      artist: "WWBA",
    },
    {
      id: '9', 
      name: "Disclosure",
      audio: "disclosure.mp3",
      artist: "DCLE",
    },
    {
      name: "EyesOnFire",
      audio: "eyesOnFire.mp3",
      artist: "EOF",
      id: '10', 
    },
    {
      name: "cinema",
      audio: "cinema.mp3",
      artist: "CNA",
      id: '11', 
    },
    {
      name: "habits",
      audio: "habits.mp3",
      artist: "HBS",
      id: '12', 
    },
    {
      name: "sayIt",
      audio: "sayIt.mp3",
      artist: "SYT",
      id: '13', 
    },
    {
      name: "neverBeLikeYou",
      audio: "neverBeLikeYou.mp3",
      artist: "NBLY",
      id: '14', 
    },
    
  ];

const AudioActionsContainer = ({ handleSelectAudio }: { handleSelectAudio: (audio: Audio | undefined) => void; } ) => {
  const [audioList, setSelectedAudioList] = useState<Audio[]>(audioParams);  
  const [selectedAudio, setSelectedAudio] = useState<Audio | undefined>(audioParams[0]);
  
  const handleAudioChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setSelectedAudio(audioList.find((audio:Audio) => audio.id === value));
  };

  useEffect(() => {
    console.log(selectedAudio);
    handleSelectAudio(selectedAudio);
  }, [selectedAudio])

  return (
    <>
      <div className="audioActionsDiv">
        <FormControl>
          <InputLabel id="demo-simple-select-label">Audio</InputLabel> 
          <Select 
          labelId="demo-simple-select-label"
          id="demo-simple-select"  
          value={selectedAudio?.id} 
          onChange={handleAudioChange}
          label="Audio src"
          >
              {audioList.map((audioData) => (
              <MenuItem
              key={audioData.id}
              value={audioData.id}
              >
              {audioData.name}
              </MenuItem>
              ))}
          </Select>
        </FormControl>
    </div>
    </>
  );
};

export default AudioActionsContainer;
