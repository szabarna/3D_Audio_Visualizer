import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame } from "@react-three/fiber";
import gsap from 'gsap';
import { CylinderVisualizerShaderMaterial } from "../../shaders/cylinder/CylinderVisualizerShaderMaterial";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";


let audioContext: AudioContext, source, analyser: AnalyserNode, freqArray:Uint8Array, waveArray:Float32Array;
const minVocalFrequency = 80; // Hz
const maxVocalFrequency = 400; // Hz

const play = () => {
    console.log("im playing")
   
}

const setupAudioContext = (audioElement:HTMLAudioElement) => {

    audioContext = new window.AudioContext();
    source = audioContext.createMediaElementSource((audioElement as HTMLAudioElement));
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 128;
    analyser.smoothingTimeConstant = 0.8;
    freqArray = new Uint8Array( analyser.fftSize );
     console.log(freqArray.length);
     waveArray = new Float32Array( analyser.fftSize );
    (audioElement as HTMLAudioElement).volume = 0.1;

}

const setupAudioContextWithMicrophone = () => {

    audioContext = new AudioContext();
     analyser = audioContext.createAnalyser();
     analyser.connect(audioContext.destination);
     analyser.fftSize = 4096;
     analyser.smoothingTimeConstant = 0.8;
     freqArray = new Uint8Array( analyser.fftSize );
     waveArray = new Float32Array( analyser.fftSize );
     console.log(freqArray.length);

     navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
         // Create a media stream source and connect it to the analyzer node
         const source = audioContext.createMediaStreamSource(stream);
         source.connect(analyser);
        
       }).catch((error) => {
         console.log("Error getting user media:", error);
       });
 
 }


export default function CylinderVisualizer() {

    const visualizerMat = useRef<any>();
    const visualizerMesh = useRef<any>();
    const bloomRef = useRef<any>();
    const audioElement = (document.getElementById('audio') as HTMLAudioElement);

    const onKeyDown = (e: KeyboardEvent ) => {

        if(e.key === 'p') {
            if(!audioElement.paused) audioElement.pause();
            else audioElement.play();
        }
    }

    useEffect(() => {
        // setupAudioContextWithMicrophone();
        window.addEventListener('keydown', onKeyDown);

        if(audioElement) {
            setupAudioContext(audioElement);
            audioElement.onplay = play;
            
        }

        return () => {
            window.removeEventListener('keydown', onKeyDown );
          }
        
    }, []);

 

    useFrame(({clock}) => {
        visualizerMat.current.uniforms.uTime2.value = clock.getElapsedTime();
        visualizerMat.current.uniforms.uTime.value = clock.getElapsedTime();

      // visualizerMesh.current.rotation.y += clock.getElapsedTime() * 0.1;

        if(analyser && freqArray && visualizerMat) {

            analyser.getByteFrequencyData(freqArray);
            analyser.getFloatTimeDomainData(waveArray);
            
            if (visualizerMesh.current) {

                let sumSquares = 0.0;

                for(const amplitude of waveArray) {
                    sumSquares += amplitude * amplitude;
                }

                const volume = Math.sqrt(sumSquares / waveArray.length);


                    // filter freqArray to get only the values in the vocal range
                const vocalRangeValues = freqArray.slice(
                    Math.round(minVocalFrequency * (analyser.fftSize / audioContext.sampleRate)),
                    Math.round(maxVocalFrequency * (analyser.fftSize / audioContext.sampleRate))
                );

                
                
                // get the maximum value in the vocal range
                const maxVocalValue = vocalRangeValues.reduce((acc, val) => Math.max(acc, val), 0);
                
                // normalize the maxVocalValue to a value between 0 and 1
                const normalizedMaxVocalValue = maxVocalValue / 255;
          
                
                if(!audioElement.paused) {
                    // console.log(freqArray)
                    // console.log(freqArray[0] / 255.0)
                    // console.log(normalizedMaxVocalValue)
                    // console.log( bloomRef.current.intensity )
 
                }

            
                // first freq to uniform
                visualizerMesh.current.material.uniforms.uFrequency.value = ( freqArray[38] / 255 );
                bloomRef.current.intensity = 0.05 + (freqArray[38] / 1000);
                // music volume to uniform
                visualizerMesh.current.material.uniforms.uVolume.value = volume;

                // highest freq to uniform
                
                visualizerMesh.current.material.uniforms.uHighestFreq.value = ( normalizedMaxVocalValue );
        
                
                visualizerMesh.current.geometry.attributes.position.needsUpdate  = true;

              }
        }
        
    })
    

    return (
        <>  
              <EffectComposer autoClear={false}>
                
                 <Bloom ref={bloomRef}  intensity={0.05} luminanceSmoothing={0.5} luminanceThreshold={0.0} />  
                 {/* <ChromaticAberration offset={ new THREE.Vector2(0.0005, 0.0005) } /> */}
            
              </EffectComposer> 
            <mesh
             ref={visualizerMesh}
            // rotation={[Math.PI * 1.6, 0, 0]}
            rotation={[Math.PI / 2, 0 , 0]} 
            >
                <cylinderGeometry  attach={'geometry'} args={[5, 5, 50, 512, 512, true ]} />
                <shaderMaterial ref={ visualizerMat } attach={'material'} args={[CylinderVisualizerShaderMaterial]}  />
            </mesh>
        </>
      );
}


