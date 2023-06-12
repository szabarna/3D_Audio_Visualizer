import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import gsap from 'gsap';
import { VisualizerShaderMaterial2 } from "../../shaders/VisualizerShaderMaterial2";

let audioContext, source, analyser: AnalyserNode, freqArray:Uint8Array, waveArray:Uint8Array, randoms:Float32Array, displacedPos:Float32Array;

let freq_samples = 64;
let time_samples = 64;

let n_vertices = (freq_samples + 1) * (time_samples + 1);
let x_segments = time_samples;
let y_segments = freq_samples;

let x_size = 2;
let y_size = 1;
let x_half_size = x_size / 2;
let y_half_size = y_size / 2;
let x_segment_size = x_size / x_segments;
let y_segment_size = y_size / y_segments;

let heights:any;


const play = () => {
    console.log("im playing")
    setupAudioContext();
}

const setupAudioContext = () => {

    audioContext = new window.AudioContext();
    const audioElement = document.getElementById('audio');
    source = audioContext.createMediaElementSource((audioElement as HTMLAudioElement));
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = freq_samples * 4;
    analyser.smoothingTimeConstant = 0.8;
    analyser.minDecibels = -100;
    analyser.maxDecibels = -30;
    freqArray = new Uint8Array( analyser.frequencyBinCount );
     console.log(freqArray.length);

     waveArray = new Uint8Array( analyser.frequencyBinCount );
    (audioElement as HTMLAudioElement).volume = 0.1;

}

export default function PlaneVisualizer() {

    const visualizerMat = useRef<any>();
    const visualizerMesh = useRef<any>();

    useEffect(() => {

        let indices = [];
        heights = [];
        let vertices = [];

        // generate vertices for a simple grid geometry
	    for (let i = 0; i <= x_segments; i ++ ) {
		    let x = ( i * x_segment_size ) - x_half_size; //midpoint of mesh is 0,0
		    for ( let j = 0; j <= y_segments; j ++ ) {
                let y = (j * y_segment_size) - y_half_size;
                vertices.push( x, y, 0);
                heights.push(0); // for now our mesh is flat, so heights are zero
		    }
	    }
	    // Add the position data to the geometry buffer
        heights = new Uint8Array(heights);
	    visualizerMesh.current.geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        visualizerMesh.current.geometry.setAttribute( 'displace', new THREE.Float32BufferAttribute( heights, 1 ) );
        visualizerMesh.current.geometry.computeVertexNormals();

        for (let i = 0; i < x_segments; i ++ ) {

            for ( let j = 0; j < y_segments; j ++ ) {
                let a = i * ( y_segments + 1 ) + ( j + 1 );
                let b = i * ( y_segments + 1 ) + j;
                let c = ( i + 1 ) * ( y_segments + 1 ) + j;
                let d = ( i + 1 ) * ( y_segments + 1 ) + ( j + 1 );
                // generate two faces (triangles) per iteration
                indices.push( a, b, d ); // face one
                indices.push( b, c, d ); // face two
            }
        }
        visualizerMesh.current.geometry.setIndex( indices );


        const audioElement = document.getElementById('audio');

        if(audioElement) {
            audioElement.onplay = play;
            console.log(visualizerMesh.current.geometry.attributes)
            // const posLength = visualizerMesh.current.geometry.attributes.position.count;
            // const currentPos = visualizerMesh.current.geometry.attributes.position.array;
            
        }

        
    }, []);

    useFrame(({clock}) => {
       // visualizerMat.current.uniforms.uTime2.value = clock.getElapsedTime();
       // visualizerMat.current.uniforms.uTime.value = clock.getElapsedTime();

        if(analyser && freqArray && visualizerMat && heights) {

            analyser.getByteFrequencyData(freqArray);
            analyser.getByteTimeDomainData(waveArray);
            
            let start_val = freq_samples + 1;
            let end_val = n_vertices - start_val;

            heights.copyWithin(0, start_val, n_vertices + 1);
            heights.set(freqArray, end_val - start_val);

            visualizerMesh.current.geometry.setAttribute( 'displace', new THREE.Float32BufferAttribute( heights, 1 ) );
            visualizerMesh.current.geometry.computeVertexNormals();
            // console.log(freqArray);             
         
        }
        
    })

    return (
        <>
            <points
             ref={visualizerMesh}
             rotation={[Math.PI * 1.6, 0, 0]}
            >
                <bufferGeometry  attach={'geometry'} />
                <shaderMaterial ref={ visualizerMat } attach={'material'} args={[VisualizerShaderMaterial2]} wireframe={false} />
            </points>
        </>
      );
}


