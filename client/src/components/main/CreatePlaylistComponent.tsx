import React, { ChangeEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { Playlist } from "../../models/types";

export const CreatePlaylistComponent = ({
  isVisible,
}: {
  isVisible: boolean;
}) => {
  const [playlistData, setPlaylistData] = useState<Playlist>({
    name: "",
    userId: "1",
    description: "",
    img: null,
  });

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPlaylistData({ ...playlistData, name: value });
  };

  const handleDescChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setPlaylistData({ ...playlistData, description: value });
  };

  const handleImgChange = (event: ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const files = target.files;

    if (files && files.length > 0) {
      const file = files[0];
      setPlaylistData({ ...playlistData, img: file });
    }
  };

  const handleCreatePlaylist = async () => {
    const formData = new FormData();
    formData.append("name", playlistData.name);
    formData.append("description", playlistData.description);
    formData.append("userId", playlistData.userId)
    if (playlistData.img) {
      formData.append("file", playlistData.img);
    }

    console.log(formData);

    try {
      const response = await fetch("http://localhost:7007/api/playlist/create", {

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
          <input type="file" name="image" onChange={handleImgChange} />
        </div>
      </div>
      <div className="createPlaylistRightInner">
        <TextField
          required
          id="outlined-required"
          label="Name"
          defaultValue="My Playlist"
          className="playlistTF"
          onChange={handleNameChange}
        />
        <TextField
          id="outlined-required"
          label="Description"
          defaultValue="..."
          className="descTF"
          onChange={handleDescChange}
        />
        <button className="playlistCreateButton" onClick={handleCreatePlaylist}>
          Create
        </button>
      </div>
    </div>
  ) : null;
};
