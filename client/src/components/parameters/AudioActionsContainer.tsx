import  { useState, useEffect } from "react";
import { PlaylistResponse, PlaylistWithBuffer } from "../../models/types";
import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toBase64 } from "../../utils/conversion";


const AudioActionsContainer = ({ currentPlaylistId, handleOpenCreatePlaylist, handleOpenPlaylist }: { handleOpenCreatePlaylist: () => void; handleOpenPlaylist: (playlist: PlaylistWithBuffer) => void; currentPlaylistId: number | undefined; } ) => {

  const [expanded, setExpanded] = useState<boolean>(true);
  const [playlists, setPlaylists] = useState<PlaylistWithBuffer[]>([]);
  const [playlistCount, setPlaylistCount] = useState<number>(0);
  

  const toggleExpanded = () => {
    setExpanded(!expanded);
  }

  const fetchAllPlaylistByUserId = async (userId: string) => {
    
    try {
      const response = await fetch(`http://localhost:7007/api/playlists/${userId}`, {
        method: "GET",
      });

      await response.json().then((result:PlaylistResponse) => {
        setPlaylists( result.items );
        setPlaylistCount( result.count );
      
        console.log(result);
      });
      
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };


  useEffect(() => {
    fetchAllPlaylistByUserId('1');
  }, []);

  return (
    <>
      <div className="audioActionsDiv">
        <div className="audioActionsTopDiv">
          <h2>Your Playlists</h2>
          <div className="playlistActionContainer">
            <AddIcon className="playlistIcon" onClick={ handleOpenCreatePlaylist } />
            { expanded ? <ExpandLessIcon className="playlistIcon" onClick={toggleExpanded} /> : <ExpandMoreIcon className="playlistIcon" onClick={toggleExpanded} /> }
          </div>
        </div>
        <div className="audioActionsMainDiv" >
          {   playlists.map((playlist) => {
            return <div 
            key={playlist.id} 
            className="playlistDiv"
            onClick={() => handleOpenPlaylist(playlist)}
            style={ currentPlaylistId === playlist.id ? { backgroundColor: '#242424' } : {}  } 
            >
              <img width={48} height={48} src={`data:image/png/jpeg;base64,${toBase64(playlist.img?.data)}`} alt={`${playlist.name}'s bg`} />
              <div className="playlistInfo">
                <h3>{playlist.name}</h3>
                <div>
                  <h4>Playlist</h4>
                  <h4>-</h4>  
                  <h4>{playlistCount}</h4>
                </div>
              </div>
            </div>
          })    }
        </div>
    </div>
    </>
  );
};

export default AudioActionsContainer;
