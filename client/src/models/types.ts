import { Vector3 } from "three";

type Audio = {
    id: string;
    name: string,
    artist: string;
    audio: string;
};

type Scene = { 
    name: string;
    jsx: (props: any) => JSX.Element;
    selected: boolean;
    detailLevel: number;
    cameraPos: Vector3;
};

type Playlist = {
    userId: string;
    name: string;
    description: string;
    img: File | null;
}

export type { Audio, Scene, Playlist };