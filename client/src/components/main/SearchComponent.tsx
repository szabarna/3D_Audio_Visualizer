import { useEffect, useRef, useState } from "react";
import { TrackResponse, TrackWithBuffer } from "../../models/types";
import { toBase64 } from "../../utils/conversion";
import PlayCircleFilledIcon from '@mui/icons-material/PlayCircleFilled';

export const SearchComponent = ({ isVisible, handleCurrentTrack }: { isVisible: boolean; handleCurrentTrack: (currentTrack: TrackWithBuffer) => void; }) => {

    const [trackList, setTrackList] = useState<TrackWithBuffer[]>([]);
    const [trackCount, setTrackCount] = useState<number>(0);
    const [hoveredTrack, setHoveredTrack] = useState<number | null>(null);
    const [currentTrackId, setCurrentTrackId] = useState<number>(0);

    const fetchTracks = async () => {
        try {
        const response = await fetch("http://localhost:7007/api/tracks/", {
            method: "GET",
        });
        await response.json().then((result:TrackResponse) => {
            console.log(`Succesfully fetched ${result.count} Track`);
            const indexedTracks = result.items.map((track, index) => ({ ...track, index }));
            setTrackCount(result.count)
            setTrackList(indexedTracks);
        });
        
        } catch (error) {
        console.log("An error occurred:", error);
        }
    };

    useEffect(() => {

    fetchTracks();

    }, []);

    const handleTrackClick = async (track: TrackWithBuffer) => {
            // Construct the audio stream URL based on the track ID
            const audioStreamURL = `http://localhost:7007/api/stream/${track.id}`;

            // Update the currentTrack with the constructed audio URL
            const trackWithAudio = {
                ...track,
                audio: audioStreamURL
            };

            // Pass the updated track with audio URL to handleCurrentTrack
            handleCurrentTrack(trackWithAudio);
            setCurrentTrackId(track.id);
    };


  return isVisible ? (
    <div className="searchTrackMainDiv">
        <div className="searchTrackTopDiv">
            <h1>Find your Track</h1>
            <h2>Track count: {trackCount}</h2>
        </div>
        <div className="trackHeader">
            <div className="trackHeaderLeft">
                <span>#</span>
                <h4>Title</h4>
            </div>
            <div className="trackHeaderRight">
                <h4>Type</h4>
                <h4>Album</h4>
                <h4>Length</h4>
            </div>
        </div>
        { trackList.map((track) => {
            return (
                <div 
                className="trackDiv" 
                key={track.id}
                onMouseEnter={() => setHoveredTrack(track.index)}
                onMouseLeave={() => setHoveredTrack(null)}
                >
                    <div className="leftTrackDiv">
                        { hoveredTrack === track.index ? <PlayCircleFilledIcon onClick={() => handleTrackClick(track)} className="trackPlayIcon" /> : <h2 style={ currentTrackId === track.id ? { color: 'rgb(0, 255, 155)' } : {} }>{track.index}</h2> }
                        <div className="trackImgTextDiv">
                            <img width={48} height={48} src={track.img ? `data:image/png/jpeg;base64,${toBase64(track.img?.data)}` : undefined} alt={`${track.title}'s bg`} />
                            <div className="trackInfoDiv">
                                <h3 style={ currentTrackId === track.id ? { color: 'rgb(0, 255, 155)' } : {} } >{track.title}</h3>
                                <h4>{track.artist}</h4>
                            </div>
                        </div>
                    </div>
                    <div className="rightTrackDiv">
                        <h4>{track.type_id}</h4>
                        <h4>Album name</h4>
                        <h4>Track length</h4>
                    </div>
                </div>
            );
        }) }
    </div>
  ) : null;
};
