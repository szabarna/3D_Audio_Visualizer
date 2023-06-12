import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from 'gsap';
import { VisualizerShaderMaterial2 } from "../../shaders/VisualizerShaderMaterial2";

let audioContext, source, analyser: AnalyserNode, freqArray:Uint8Array, waveArray:Uint8Array, randoms:Float32Array, displacedPos:Float32Array;


const play = () => {
    console.log("im playing")
    
}

const setupAudioContext = () => {

    audioContext = new window.AudioContext();
    const audioElement = document.getElementById('audio');
    source = audioContext.createMediaElementSource((audioElement as HTMLAudioElement));
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
    analyser.smoothingTimeConstant = 0.8;
    freqArray = new Uint8Array( analyser.frequencyBinCount );
    console.log(freqArray.length);

     waveArray = new Uint8Array( analyser.frequencyBinCount );
    (audioElement as HTMLAudioElement).volume = 0.1;

}

const bars:any = [];
let barCount:number;
const barSpacing = 0.15;
const barWidth = 0.001;
const barHeight = 2;

export default function Visualizer() {

    const visualizerMat = useRef<any>();
    const visualizerMesh = useRef<any>();

    const { scene } = useThree();


    useEffect(() => {


        const audioElement = document.getElementById('audio');

        if(audioElement) {
            setupAudioContext();
            audioElement.onplay = play;
            console.log(visualizerMesh.current.geometry.attributes)
            // const posLength = visualizerMesh.current.geometry.attributes.position.count;
            // const currentPos = visualizerMesh.current.geometry.attributes.position.array;
        }

        barCount = analyser.fftSize / 2;
      
        for (let i = 0; i < barCount; i++) {

            const geometry = new THREE.BoxGeometry(barWidth, barHeight, 0.25);
            const material = new THREE.ShaderMaterial(VisualizerShaderMaterial2);
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (barWidth + barSpacing) * i - ((barWidth + barSpacing) * barCount) / 2 + barWidth / 2;
            scene.add(mesh);
            bars.push(mesh);
        }

    }, []);

    useFrame(({clock}) => {
       // visualizerMat.current.uniforms.uTime2.value = clock.getElapsedTime();
       // visualizerMat.current.uniforms.uTime.value = clock.getElapsedTime();

        if(analyser && freqArray) {

            analyser.getByteFrequencyData(freqArray);
            // console.log(freqArray);             
            visualizerMesh.current.geometry.attributes.position.array = freqArray;
            visualizerMesh.current.geometry.attributes.position.needsUpdate = true;

            for (let i = 0; i < barCount; i++) {
                bars[i].scale.y = 0.1 + (freqArray[i] / 255) * 10.0;
                // bars[i].material.color.setHex(Math.random() * 0xffffff);
              }

        }
        
    })

    return (
        <>
            <mesh
             ref={visualizerMesh}
             rotation={[Math.PI * 1.6, 0, 0]}
             visible={false}
            >
                <planeBufferGeometry  attach={'geometry'} args={[1, 1, 255, 1]} />
                <shaderMaterial ref={ visualizerMat } attach={'material'} args={[VisualizerShaderMaterial2]} wireframe={true} />
            </mesh>
        </>
      );
}


