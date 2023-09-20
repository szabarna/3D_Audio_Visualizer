import  { useState, useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Audio } from "../../models/types";
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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
    {
      name: "Babel",
      audio: "babel.mp3",
      artist: "BBL",
      id: '15', 
    },
    {
      name: "After Dark",
      audio: "afterDark.mp3",
      artist: "AFRD",
      id: '16', 
    },
    {
      name: "Ants",
      audio: "ants.mp3",
      artist: "edIT",
      id: '17', 
    },
    {
      name: "Graves",
      audio: "graves.mp3",
      artist: "GVS",
      id: '18', 
    },
    {
      name: "Feel Good",
      audio: "feelGood.mp3",
      artist: "Gorillaz",
      id: '19', 
    },
    {
      name: "Tequila Shots",
      audio: "kidCudi.mp3",
      artist: "Kid Cudi",
      id: '20', 
    },
    
];

const AudioActionsContainer = ({ handleSelectAudio, handleOpenModal }: { handleSelectAudio: (audio: Audio | undefined) => void; handleOpenModal: () => void; } ) => {
  const [audioList, setSelectedAudioList] = useState<Audio[]>(audioParams);  
  const [selectedAudio, setSelectedAudio] = useState<Audio | undefined>(audioParams[0]);
  const [expanded, setExpanded] = useState<boolean>(true);
  
  const handleAudioChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setSelectedAudio(audioList.find((audio:Audio) => audio.id === value));
  };

  const toggleExpanded = () => {
    setExpanded(!expanded);
  }

  useEffect(() => {
    console.log(selectedAudio);
    handleSelectAudio(selectedAudio);
  }, [selectedAudio])

  return (
    <>
      <div className="audioActionsDiv">
        <div className="audioActionsTopDiv">
          <h2>Your Playlists</h2>
          <div className="playlistActionContainer">
            <AddIcon className="playlistIcon" onClick={ handleOpenModal } />
            { expanded ? <ExpandLessIcon className="playlistIcon" onClick={toggleExpanded} /> : <ExpandMoreIcon className="playlistIcon" onClick={toggleExpanded} /> }
          </div>
        </div>
        <div className="audioActionsMainDiv">
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
    </div>
    </>
  );
};

export default AudioActionsContainer;
