import { Vector3 } from "three";


type Scene = { 
    name: string;
    jsx: (props: any) => JSX.Element;
    selected: boolean;
    detailLevel: number;
    cameraPos: Vector3;
};

type SerializedBuffer = {
    type: 'Buffer';
    data: number[];
};


type Playlist = {
    userId: string;
    name: string;
    description: string;
    img: File | null;
};

type PlaylistWithBuffer = {
    id: number;
    userId: string;
    name: string;
    description: string;
    img: SerializedBuffer;
    count: number;
};

type PlaylistResponse = {
    items: PlaylistWithBuffer[];
    count: number;
};

type Track = {
    title: string;
    artist: string;
    audio: File | null;
    img: File | null;
    type_id: string;
}

type TrackWithBuffer = {
    title: string;
    artist: string;
    audio: string;
    img: SerializedBuffer;
    count: number;
    index: number;
    id: number;
    type_id: string;
}

type TrackResponse = {
    items: TrackWithBuffer[];
    count: number;
};

type TrackType = {
    id: string;
    name: string;
};

export type { Scene, Playlist, PlaylistResponse, PlaylistWithBuffer, Track, TrackWithBuffer, TrackResponse, TrackType };