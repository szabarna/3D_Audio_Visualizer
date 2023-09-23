import React, { ChangeEvent, useState } from "react";
import TextField from "@mui/material/TextField";
import { PlaylistWithBuffer } from "../../models/types";
import { toBase64 } from "../../utils/conversion";

export const CurrentPlaylistComponent = ({ currentPlaylist }: { currentPlaylist: PlaylistWithBuffer | null;}) => {

  return currentPlaylist ? (
    <div className="currentPlaylistDiv">
        <img width={256} height={256} src={`data:image/png/jpeg;base64,${toBase64(currentPlaylist.img?.data)}`} alt={`${currentPlaylist.name}'s bg`} />
        <div className="currentPlaylistInfo">
            <h4>Playlist</h4>
            <h1>{currentPlaylist.name}</h1>
            <div className="playlistTextInfo">
                <h4>user pic, name</h4>
                <h4>-</h4>
                <h4>track count</h4>
            </div>
        </div>
    </div>
  ) : null;
};
