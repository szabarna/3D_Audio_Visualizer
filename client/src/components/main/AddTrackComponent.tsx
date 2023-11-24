import React, { ChangeEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Playlist, Track, TrackType } from "../../models/types";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";

export const AddTrackComponent = ({
  isVisible,
}: {
  isVisible: boolean;
}) => {
  const [trackTypes, setTrackTypes] = useState<TrackType[]>([]);
  const [trackData, setTrackData] = useState<Track>({
    title: "",
    artist: "",
    audio: null,
    img: null,
    type_id: ""
  });

  const handleTracktypeChange = (event: SelectChangeEvent<string>) => {
    const { value } = event.target;
    setTrackData({ ...trackData, type_id: value });
  };

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTrackData({ ...trackData, title: value });
  };

  const handleArtistChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setTrackData({ ...trackData, artist: value });
  };

  const handleImgChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const files = target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setTrackData({ ...trackData, img: file });
    }
  };

  const handleAudioChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const files = target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setTrackData({ ...trackData, audio: file });
    }
  };

  const handleCreateTrack = async () => {
    const formData = new FormData();
  
   
    if (trackData.img && trackData.audio) {
      formData.set("title", trackData.title);
      formData.set("artist", trackData.artist);
      formData.set("type_id", trackData.type_id);
      formData.set("img", trackData.img);
      formData.set("audio", trackData.audio);
    }

    console.log(formData);

    try {
      const response = await fetch("http://localhost:7007/api/track/create", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  const fetchTrackTypes = async () => {
    try {
      const response = await fetch("http://localhost:7007/api/track_types", {
        method: "GET",
      });
      const result = await response.json();
      console.log(result);
      setTrackTypes(result.items);

    } catch (error) {
      console.log("An error occurred:", error);
    }
  }

  useEffect(() => {
     fetchTrackTypes(); 
  }, [])

  return isVisible ? (
    <div className="createPlaylistDiv">
      <div className="createPlaylistLeftInner">
        <div className="createPlaylistImg">
          <input type="file" id="img" name="img" onChange={handleImgChange} />
        </div>
      </div>
      <div className="createPlaylistRightInner">
        <TextField
          required
          id="outlined-required"
          label="Title"
          defaultValue="Track Title"
          className="trackTitleTF"
          onChange={handleTitleChange}
        />
        <TextField
          id="outlined-required"
          label="Artist"
          defaultValue="..."
          className="trackArtistTF"
          onChange={handleArtistChange}
        />
          <FormControl >
            <InputLabel id="demo-simple-select-label">Genre</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select" 
              value={trackData.type_id}
              onChange={handleTracktypeChange} 
              label="Track type"
              fullWidth={true}
            >
              { trackTypes.map((track:TrackType) => {
                return ( <MenuItem key={track.id} value={track.id}>{track.name}</MenuItem> );
              }) }
            </Select>
          </FormControl>
        <input type="file" name="audio" id="audio" onChange={handleAudioChange} />

        <button className="playlistCreateButton" onClick={handleCreateTrack}>
          Create
        </button>
      </div>
    </div>
  ) : null;
};
