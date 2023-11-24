import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { TorusVisualizerShaderMaterial } from "../../shaders/torus/TorusVisualizerShaderMaterial";
import { getAverageAmplitudeForFrequencyRange } from "../../utils/audio";
import CustomShaderMaterial from 'three-custom-shader-material'
import { OrbitControls } from "@react-three/drei";
import { EffectComposer, Sepia } from "@react-three/postprocessing";

let freqArray:Uint8Array, waveArray:Float32Array;

const setupAudioContext = (analyser: AnalyserNode) => {
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85; // if the track is fast set it to 0.85 needs to be parameter
    freqArray = new Uint8Array(analyser.fftSize);
    waveArray = new Float32Array(analyser.fftSize);
  };


export default function TorusVisualizer({ currentAudioElement, sampleRate, analyser, cameraPos, detailLevel }: { currentAudioElement: HTMLAudioElement | null,sampleRate: number; analyser: AnalyserNode | null; cameraPos: THREE.Vector3, detailLevel: number; }) {

    const visualizerMat = useRef<any>();
    const visualizerMesh = useRef<any>();
    const sepiaRef = useRef<any>();
    const { scene, camera } = useThree();
    const fftSize = analyser?.fftSize;

    useEffect(() => {
  
        camera.position.copy(cameraPos);
    
        if (analyser && currentAudioElement && sampleRate) {
          setupAudioContext(analyser);
        }
    
      });
    
      useFrame(({ clock }) => {
     
        if (analyser && freqArray && visualizerMat && currentAudioElement && fftSize) {
    
          analyser.getByteFrequencyData(freqArray);
    
          const bassAverage = getAverageAmplitudeForFrequencyRange(
            freqArray,
            sampleRate,
            fftSize,
            1,
            250
          );
          const lowerMidrangeAverage = getAverageAmplitudeForFrequencyRange(
            freqArray,
            sampleRate,
            fftSize,
            250,
            500
          );
          const midrangeAverage = getAverageAmplitudeForFrequencyRange(
            freqArray,
            sampleRate,
            fftSize,
            500,
            2000
          );
          const higherMidrangeAverage = getAverageAmplitudeForFrequencyRange(
            freqArray,
            sampleRate,
            fftSize,
            2000,
            4000
          );
          const presenceAverage = getAverageAmplitudeForFrequencyRange(
            freqArray,
            sampleRate,
            fftSize,
            4000,
            6000
          );
          const brillianceAverage = getAverageAmplitudeForFrequencyRange(
            freqArray,
            sampleRate,
            fftSize,
            6000,
            10000
          );
    
          if (visualizerMesh.current) {
    
            let sumSquares = 0.0;
    
            for (const amplitude of waveArray) {
              sumSquares += amplitude * amplitude;
            }
    
            const volume = Math.sqrt(sumSquares / waveArray.length);
    
            if (!currentAudioElement.paused) {
    
             // scene.rotation.y = -clock.getElapsedTime() * 0.25;
             // scene.position.y = Math.sin(clock.getElapsedTime() * 0.625) * 2.75;
             // camera.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 100;
                
            }
    
            visualizerMesh.current.material.uniforms.uFrequency.value =
              ( midrangeAverage + higherMidrangeAverage + presenceAverage +
              brillianceAverage) /
              1.0;
    
            visualizerMesh.current.material.uniforms.uVolume.value = volume;
    
            visualizerMesh.current.material.uniforms.uHighestFreq.value =
            (bassAverage + lowerMidrangeAverage) / 2.0;
    
          }

          if(sepiaRef.current) {
            //sepiaRef.current.intensity = 1.0 - ((midrangeAverage + higherMidrangeAverage + presenceAverage + brillianceAverage) / 4.0);
           // sepiaRef.current.intensity = 2.0 - (bassAverage * 2.0);
          }
        }
      });


      const sphereMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.0,
        metalness: 1.0,
       // color: 'white',
        side: THREE.DoubleSide,
        wireframe: true,
        flatShading: false
      });
    

    return (
        <>  
              {[...Array(6)].map((x, i) =>
                 <mesh
                 ref={visualizerMesh}
                 key={i}
                // rotation={[Math.PI * 1.6, 0, 0]}
                position={[0, 0, 0]}
                rotation={[0, 0 , 0]}
                userData={ { "idx": i, "name": "torus"} } 
                >
                    <torusGeometry  
                    attach={'geometry'} 
                   //  args={[4 + (i * 5.5), 1.275, 10, 300]}
                    args={[4 + (i * 7.5), 1.275, 20, 512]}  
                    />
                    <CustomShaderMaterial
                    ref={visualizerMat}
                    baseMaterial={sphereMaterial}
                    attach={"material"}
                    vertexShader={TorusVisualizerShaderMaterial.vertexShader}
                    fragmentShader={TorusVisualizerShaderMaterial.fragmentShader}
                    uniforms={TorusVisualizerShaderMaterial.uniforms}
                    key={i}
                    />
                </mesh>
             )} 

        <EffectComposer>
            <Sepia 
            ref={sepiaRef}
            intensity={0}
            />
        </EffectComposer>
            
        </>
      );
}


