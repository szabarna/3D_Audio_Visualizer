import React, { useState, useEffect, useRef } from "react";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Slider } from "@mui/material";
import AudioCanvas from "./AudioCanvas";
import { Audio } from "../../models/types";

type AudioData = {
    name: string;
    audioAsString: string;
    audio: string | null;
  };
  
  let audioParams: AudioData[] = [
    {
      name: "All I Know",
      audioAsString: "allIKnow.mp3",
      audio: null,
    },
    {
      name: "Breaking The Habit",
      audioAsString: "breakingTheHabit.mp3",
      audio: null,
    },
    {
      name: "Dreams",
      audioAsString: "dreams.mp3",
      audio: null,
    },
    {
      name: "Empty Crown",
      audioAsString: "emptyCrown.mp3",
      audio: null,
    },
    {
      name: "Hero",
      audioAsString: "hero.mp3",
      audio: null,
    },
    {
      name: "Song of Storms",
      audioAsString: "songOfStorms.mp3",
      audio: null,
    },
    {
      name: "Tour",
      audioAsString: "tour.mp3",
      audio: null,
    },
    {
      name: "We wont be alone",
      audioAsString: "weWontBeAlone.mp3",
      audio: null,
    },
    {
      name: "Disclosure",
      audioAsString: "disclosure.mp3",
      audio: null,
    },
    {
      name: "EyesOnFire",
      audioAsString: "eyesOnFire.mp3",
      audio: null,
    },
    {
      name: "cinema",
      audioAsString: "cinema.mp3",
      audio: null,
    },
    {
      name: "habits",
      audioAsString: "habits.mp3",
      audio: null,
    },
    {
      name: "sayIt",
      audioAsString: "sayIt.mp3",
      audio: null,
    },
    {
      name: "neverBeLikeYou",
      audioAsString: "neverBeLikeYou.mp3",
      audio: null,
    },
    
  ];

const AudioContainer = ({ currentAudio, handleSetSceneNull }: { currentAudio: Audio | undefined; handleSetSceneNull: () => void; }) => {
 
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLength, setCurrentLength] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaElementSource(audioRef.current as HTMLMediaElement);
    source.connect(analyserRef.current);
    analyserRef.current.connect(audioContextRef.current.destination);

  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);


  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioProgress = (event: Event, value: number | number[], activeThumb: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value as number;
      setCurrentTime(value as number);
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSceneExit = () => {
    analyserRef.current?.disconnect();
    audioContextRef.current?.close();
    handleSetSceneNull();
  }

  useEffect(() => {
    
    if (audioRef.current) {
      // When metadata is loaded, set currentLength
      audioRef.current.addEventListener('loadedmetadata', () => {
        if(!audioRef.current) return;
        setCurrentLength(audioRef.current.duration);
      });
      // Update currentTime on timeupdate event
      audioRef.current.addEventListener('timeupdate', () => {
        if(!audioRef.current) return;
        setCurrentTime(audioRef.current.currentTime);
      });
    }

  }, []);

  return (
    <>
    <div className="audioCanvas">
        <AudioCanvas analyser={analyserRef.current} />
    </div>
    <div className="audioContainer">
      
      <div className="audioInfoDiv">
        <div className="audioInfoInnerDiv">
          <h3>{currentAudio?.name}</h3>
          <h4>{currentAudio?.artist}</h4>
        </div>
      </div> 

      <div className="audioControlsDiv">
        <div className="audioSliderDiv">
            {isPlaying ? (
            <PauseCircleFilledIcon className="audioIcon" onClick={togglePlay} />
            ) : (
            <PlayCircleFilledIcon className="audioIcon" onClick={togglePlay} />
            )}
        </div>
        <div className="audioTimeDiv">
            <span>{formatTime(currentTime)}</span>
              <Slider 
                aria-label="Small"
                min={0} 
                max={Math.floor(currentLength)} 
                defaultValue={0.1} 
                value={typeof Math.floor(currentTime) === 'number' ? Math.floor(currentTime) : 0} 
                onChange={handleAudioProgress}
                size="small" 
                aria-labelledby="input-slider"
              />
      
            <span>{formatTime(currentLength)}</span>
        </div>
      </div>

      <div className="audioVolumeDiv">
        <div className="volumeIconDiv">
          { volume > 0.75 ? <VolumeUpIcon className="volumeIcon" /> : <VolumeDownIcon className="volumeIcon" /> }
        </div>
        <Slider 
          size="small"
          min={0} 
          max={1} 
          step={0.05} 
          value={volume} 
          onChange={(e, value) => setVolume(value as number)}
          valueLabelDisplay="auto" 
        />
      </div>

      <div className="actionDiv">
          <div onClick={handleSceneExit}>
            <span>&#10005;</span>
          </div> 
      </div>

      <audio 
        ref={audioRef}
        src={`./audio/${currentAudio?.audio}`} 
        id="audio" 
        controls 
        onTimeUpdate={handleTimeUpdate}
        style={{ display: 'none' }}
      />
    </div>
    </>
  );
};

export default AudioContainer;
