import React, { useState, useEffect, useRef } from "react";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import { Slider } from "@mui/material";
import AudioCanvas from "./AudioCanvas";
import { TrackWithBuffer } from "../../models/types";
import { toBase64 } from "../../utils/conversion";
import { formatTime } from "../../utils/format";


const AudioContainer = ({ currentTrack, handleSetSceneNull }: { currentTrack: TrackWithBuffer | null; handleSetSceneNull: () => void; }) => {
 
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number>(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if(currentTrack) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaElementSource(audioRef.current as HTMLMediaElement);
      source.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);

      console.log("Analyser connected")
    }
  }, [currentTrack]);


  useEffect(() => {
    if (audioRef.current && currentTrack) {
      audioRef.current.volume = volume;
    }
  }, [volume]);


  const togglePlay = () => {
    if (audioRef.current && currentTrack) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current && currentTrack) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioProgress = (event: Event, value: number | number[], activeThumb: number) => {
    if (audioRef.current && currentTrack) {
      audioRef.current.currentTime = value as number;
      setCurrentTime(value as number);
    }
  }

  const handleSceneExit = () => {
    analyserRef.current?.disconnect();
    audioContextRef.current?.close();
    handleSetSceneNull();
  }

  useEffect(() => {
    const audioElem = audioRef.current;
    
    const handleLoadedMetadata = () => {
      if (audioElem) {
        setDuration(audioElem.duration);
      }
    };

    const handleTimeUpdateEvent = () => {
      if (audioElem) {
        setCurrentTime(audioElem.currentTime);
      }
    };
    
    if (audioElem && currentTrack) {

      audioElem.addEventListener('loadedmetadata', handleLoadedMetadata);
      audioElem.addEventListener('timeupdate', handleTimeUpdateEvent);

      return () => {
        audioElem.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audioElem.removeEventListener('timeupdate', handleTimeUpdateEvent);
      };
    }

  }, [currentTrack]);

  return (
    <>
    <div className="audioCanvas">
        <AudioCanvas analyser={analyserRef.current} />
    </div>
    <div className="audioContainer">
      
      <div className="audioInfoDiv">
      <img width={64} height={64} src={ currentTrack && currentTrack.img ? `data:image/png/jpeg;base64,${toBase64(currentTrack?.img.data)}` : ''} alt={ currentTrack ? `${currentTrack.title}'s bg` : 'img'} />
        <div className="audioInfoInnerDiv">
          <h3>{currentTrack?.title}</h3>
          <h4>{currentTrack?.artist}</h4>
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
                max={Math.floor(duration)} 
                value={typeof Math.floor(currentTime) === 'number' ? Math.floor(currentTime) : 0} 
                onChange={handleAudioProgress}
                size="small" 
                aria-labelledby="input-slider"
              />
      
            <span>{formatTime(duration)}</span>
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
        src={currentTrack && currentTrack.audio ? `${currentTrack.audio}` : ''} 
        id="audio"  
        onTimeUpdate={handleTimeUpdate}
        style={{ display: 'none' }}
        crossOrigin="anonymous"
      />
    </div>
    </>
  );
};

export default AudioContainer;
