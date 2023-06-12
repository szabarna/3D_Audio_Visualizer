import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { extend, useFrame, useThree } from "@react-three/fiber";
import gsap from 'gsap';
import { SphereVisualizerShaderMaterial } from "../../shaders/sphere/SphereVisualizerShaderMaterial";
import { Bloom, DepthOfField, EffectComposer } from "@react-three/postprocessing";
import { VisualizerShaderMaterial2 } from "../../shaders/VisualizerShaderMaterial2";


let audioContext: AudioContext, source, analyser: AnalyserNode, freqArray:Uint8Array, waveArray:Float32Array;

const play = () => {
    console.log("im playing")
   
}

function getAverageAmplitudeForFrequencyRange(freqArray:Uint8Array, sampleRate:number, fftSize:number, minFrequency:number, maxFrequency:number) {
    const indexMin = Math.round(minFrequency * (fftSize / sampleRate));
    const indexMax = Math.round(maxFrequency * (fftSize / sampleRate));
    const valuesInFrequencyRange = freqArray.slice(indexMin, indexMax);

    const sum = valuesInFrequencyRange.reduce((acc, val) => acc + val, 0);
    return (sum / valuesInFrequencyRange.length) / 255;
}

const setupAudioContext = (audioElement:HTMLAudioElement) => {

    audioContext = new window.AudioContext();
    source = audioContext.createMediaElementSource((audioElement as HTMLAudioElement));
    analyser = audioContext.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 512;
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

  

export default function SphereVisualizer( props:any ) {

    const visualizerMat = useRef<any>();
    const visualizerMat2 = useRef<any>();
    const visualizerMesh = useRef<any>();
    const composer = useRef<any>();
    const bloomRef = useRef<any>();
    const audioElement = (document.getElementById('audio') as HTMLAudioElement);
    const { scene, camera } = useThree();

   

    const onKeyDown = (e: KeyboardEvent ) => {

        if(e.key === 'p') {
            if(!audioElement.paused) audioElement.pause();
            else audioElement.play();
        }
    }

    useEffect(() => {
        // setupAudioContextWithMicrophone();
        window.addEventListener('keydown', onKeyDown);

        camera.position.set(0, 0, 75);




        if(audioElement) {
            setupAudioContext(audioElement);
            audioElement.onplay = play;
            
        }

        // let freqs = new Float32Array(geometry.attributes.position.count);

        // for (let i = 0; i < freqs.length; i++) {
        // // assign each vertex a frequency band
        // // this could be done in a variety of ways, depending on your needs
        // freqs[i] = i % freqArray.length;
        // }
    
        // // add the per-vertex frequency data as an attribute to the geometry
        // geometry.setAttribute('vertexFrequency', new THREE.BufferAttribute(freqs, 1));
        // geometry.setAttribute('vertexTimeDomain', new THREE.BufferAttribute(freqs, 1));

        return () => {
            window.removeEventListener('keydown', onKeyDown );
          }
        
    }, []);

 

    useFrame(({clock}) => {
        visualizerMat.current.uniforms.uTime2.value = clock.getElapsedTime();
       // visualizerMat.current.uniforms.uTime.value = clock.getElapsedTime();

        if(analyser && freqArray && visualizerMat) {

            analyser.getByteFrequencyData(freqArray);
            analyser.getFloatTimeDomainData(waveArray);

            const sampleRate = audioContext.sampleRate;
            const fftSize = analyser.fftSize;

            const bassAverage = getAverageAmplitudeForFrequencyRange(freqArray, sampleRate, fftSize, 1, 250);
            const lowerMidrangeAverage = getAverageAmplitudeForFrequencyRange(freqArray, sampleRate, fftSize, 250, 500);
            const midrangeAverage = getAverageAmplitudeForFrequencyRange(freqArray, sampleRate, fftSize, 500, 2000);
            const higherMidrangeAverage = getAverageAmplitudeForFrequencyRange(freqArray, sampleRate, fftSize, 2000, 4000);
            const presenceAverage = getAverageAmplitudeForFrequencyRange(freqArray, sampleRate, fftSize, 4000, 6000);
            const brillianceAverage = getAverageAmplitudeForFrequencyRange(freqArray, sampleRate, fftSize, 6000, 10000);
            
            if (visualizerMesh.current) {

                let sumSquares = 0.0;

                for(const amplitude of waveArray) {
                    sumSquares += amplitude * amplitude;
                }

                const volume = Math.sqrt(sumSquares / waveArray.length);

                
                if(!audioElement.paused) {

                    // console.log(scene.rotation)

                    scene.rotation.y = -clock.getElapsedTime() * 0.15;
                    scene.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 2.5;
                   // visualizerMesh.current.rotation.z = -clock.getElapsedTime() * 0.35;
                   // visualizerMesh.current.rotation.x = -clock.getElapsedTime() * 0.35;

                //    console.log("Bass avg", bassAverage);
                //    console.log("Lower Midrange avg", lowerMidrangeAverage);
                //    console.log("Midrange avg", midrangeAverage);
                //    console.log("Higher Midrange avg", higherMidrangeAverage);
                //    console.log("Presence avg", presenceAverage);
                //    console.log("Brilliance avg", brillianceAverage);
                
                }

            
                // first freq to uniform 38
                visualizerMesh.current.material.uniforms.uFrequency.value = ( midrangeAverage );
               // bloomRef.current.intensity = 0.05 + (freqArray[38] / 350);
                // music volume to uniform
                visualizerMesh.current.material.uniforms.uVolume.value = volume;
                
                // highest freq to uniform
                
                visualizerMesh.current.material.uniforms.uHighestFreq.value = ( lowerMidrangeAverage );

                // visualizerMesh.current.material.uniforms.freqArray.value = freqArray;
                // visualizerMesh.current.material.uniforms.waveArray.value = waveArray;
             
                
                visualizerMesh.current.geometry.attributes.position.needsUpdate  = true;

              }
        }
        
    })

    const details = props.detailLevel;

    const geometry = new THREE.IcosahedronGeometry(12.5, details).toNonIndexed();
    const geometryBig = new THREE.IcosahedronGeometry(7.5, details).toNonIndexed();
    const geometryBiggest = new THREE.IcosahedronGeometry(75, details).toNonIndexed();

    let len = geometry.attributes.position.count;

    let randoms = new Float32Array(len * 3);

    for(let i = 0; i < len; i+=3) {

        let r = Math.random() * 3.25;

        randoms[i] = r;
        randoms[i+1] = r;
        randoms[i+2] = r;
    }


    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometryBig.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geometryBiggest.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    return (
        <>  
              <EffectComposer ref={ composer } autoClear={false} >
                
                <Bloom ref={bloomRef}  intensity={0.125} luminanceSmoothing={0.5} luminanceThreshold={0.0} /> 

                {/* <ToneMapping /> */}
                {/* <ChromaticAberration offset={ new THREE.Vector2(0.0005, 0.0005) } />  */}
            
              </EffectComposer> 
            <points
             ref={visualizerMesh}
            // rotation={[Math.PI * 1.6, 0, 0]}
            rotation={[0, Math.PI * -0.5, 0]}
            geometry={geometry} 
            scale={[1, 1, 1]}
            >
                {/* <icosahedronGeometry  
                attach={'geometry'} 
                args={[10, 32]}
                 /> */}
                <shaderMaterial ref={ visualizerMat } attach={'material'} args={[SphereVisualizerShaderMaterial]}  />
            </points>
            <mesh
             ref={visualizerMesh}
            // rotation={[Math.PI * 1.6, 0, 0]}
            rotation={[0, Math.PI * -0.5, 0]} 
            geometry={geometryBig}
            >
                {/* <icosahedronGeometry  attach={'geometry'} args={[30, 16]} /> */}
                <shaderMaterial ref={ visualizerMat } attach={'material'} args={[SphereVisualizerShaderMaterial]}  />
            </mesh>

            <points
             ref={visualizerMesh}
            // rotation={[Math.PI * 1.6, 0, 0]}
            rotation={[0, Math.PI * -0.5, 0]} 
            geometry={geometryBiggest}
            visible={false}
            >
                {/* <icosahedronGeometry  attach={'geometry'} args={[30, 16]} /> */}
                <shaderMaterial  ref={ visualizerMat } attach={'material'} args={[SphereVisualizerShaderMaterial]}  />
            </points>
        </>
      );
}


