import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from 'gsap';
import { CylinderVisualizerShaderMaterial } from "../../shaders/cylinder/CylinderVisualizerShaderMaterial";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { TorusVisualizerShaderMaterial } from "../../shaders/torus/TorusVisualizerShaderMaterial";
import SphereVisualizer from "./SphereVisualizer";
import { SphereVisualizerShaderMaterial } from "../../shaders/sphere/SphereVisualizerShaderMaterial";


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

const getAvgFreqByIdx = ( freqArray: Uint8Array, idx: number ) => {

    const arrayLength = freqArray.length;
    // divide the whole frequency length to 8 bars
    const dividedLength = freqArray.length / 8;

    const slicedArray = freqArray.slice(0 + (dividedLength * idx), dividedLength * (idx + 1));

    const avgFreq = slicedArray.reduce((acc, val) => Math.max(acc, val), 0)

    return avgFreq / 255.0;
}


export default function TorusVisualizer( props:any ) {

    const visualizerMat = useRef<any>();
    const visualizerMesh = useRef<any>();
    const bloomRef = useRef<any>();
    const audioElement = (document.getElementById('audio') as HTMLAudioElement);
    const { scene } = useThree();

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

                    // console.log( 
                    //     "Sub-bass: " + getAvgFreqByIdx(freqArray, 0),
                    //     "Bass: " + getAvgFreqByIdx(freqArray, 1),
                    //     "Lower Midrange: " + getAvgFreqByIdx(freqArray, 2),
                    //     "Midrange: " + getAvgFreqByIdx(freqArray, 3),
                    //     "Higher Midrange: " + getAvgFreqByIdx(freqArray, 4),
                    //     "Presence: " + getAvgFreqByIdx(freqArray, 5),
                    //     "Brilliance: " + getAvgFreqByIdx(freqArray, 6)
                    //     )
               
                    scene.children.map((obj:any) => {

                        if(obj.userData.name === "torus") {
    
                            const idx = obj.userData["idx"]
                          
                           // if(idx % 2 === 0 ) obj.rotateZ( Math.sin(clock.getElapsedTime() * 0.0002))
                           // else obj.rotateZ( Math.sin(clock.getElapsedTime() * -0.0001 ))
                           if(idx % 2 === 0 ) obj.rotation.z = clock.getElapsedTime() * 0.2;
                           else obj.rotation.z = clock.getElapsedTime() * -0.1;

                           // obj.material.uniforms.uFrequency.value = getAvgFreqByIdx(freqArray, 2);
                     
                            
                           // console.log(idx, obj.material.uniforms.uColor.value)

                        }
                        
                    });
                }
                
            
                // first freq to uniform
                visualizerMesh.current.material.uniforms.uFrequency.value = ( freqArray[38] / 255 );
               // bloomRef.current.intensity = 0.05 + (freqArray[38] / 500);
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
              {[...Array(6)].map((x, i) =>
                 <points
                 ref={visualizerMesh}
                 position={[0, 0, 0 ]}
                 key={i}
                // rotation={[Math.PI * 1.6, 0, 0]}
                rotation={[0, 0 , 0]}
                userData={ { "idx": i, "name": "torus"} } 
                >
                    <torusGeometry  
                    attach={'geometry'} 
                   //  args={[4 + (i * 5.5), 1.275, 10, 300]}
                    args={[4 + (i * 5.5), 1.275, 25, 300]}  
                    />
                    <shaderMaterial 
                    ref={ visualizerMat } 
                    attach={'material'} 
                    args={[TorusVisualizerShaderMaterial]} 
                    key={i}
                  
                    />
                </points>
             )} 

           
            
        </>
      );
}


