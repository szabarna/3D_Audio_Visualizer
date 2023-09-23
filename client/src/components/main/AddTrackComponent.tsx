import React, { ChangeEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { Playlist, Track } from "../../models/types";

export const AddTrackComponent = ({
  isVisible,
}: {
  isVisible: boolean;
}) => {
  const [trackData, setTrackData] = useState<Track>({
    title: "",
    artist: "1",
    audio: null,
    img: null,
    type_id: 0
  });

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
        <input type="file" name="audio" id="audio" onChange={handleAudioChange} />

        <button className="playlistCreateButton" onClick={handleCreateTrack}>
          Create
        </button>
      </div>
    </div>
  ) : null;
};
