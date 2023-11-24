import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import gsap from 'gsap';
import { CylinderVisualizerShaderMaterial } from "../../shaders/cylinder/CylinderVisualizerShaderMaterial";
import { Bloom, ChromaticAberration, EffectComposer } from "@react-three/postprocessing";
import { getAverageAmplitudeForFrequencyRange } from "../../utils/audio";
import CustomShaderMaterial from 'three-custom-shader-material'


let freqArray:Uint8Array, waveArray:Float32Array;



const setupAudioContext = (analyser: AnalyserNode) => {
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.85; // if the track is fast set it to 0.85 needs to be parameter
    freqArray = new Uint8Array(analyser.fftSize);
    waveArray = new Float32Array(analyser.fftSize);
  };


export default function CylinderVisualizer( { currentAudioElement, sampleRate, analyser, cameraPos, detailLevel }: { currentAudioElement: HTMLAudioElement | null,sampleRate: number; analyser: AnalyserNode | null; cameraPos: THREE.Vector3, detailLevel: number; } ) {

    const visualizerMat = useRef<any>();
    const visualizerMesh = useRef<any>();
    const bloomRef = useRef<any>();
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
              visualizerMesh.current.rotation.y = clock.getElapsedTime() * 0.15;
    
            }
    
            visualizerMesh.current.material.uniforms.uFrequency.value =
              ( midrangeAverage + higherMidrangeAverage + presenceAverage +
              brillianceAverage) /
              1.0;
    
            visualizerMesh.current.material.uniforms.uVolume.value = volume;
    
            visualizerMesh.current.material.uniforms.uHighestFreq.value =
            (bassAverage + lowerMidrangeAverage) / 2.0;
    
          }
        }
      });
    
      const geometry = new THREE.CylinderGeometry(50, 75, 500, 256, 256, true);
    
      const cylinderMaterial = new THREE.MeshStandardMaterial({
        roughness: 0.1,
        metalness: 1.0,
       // color: 'white',
        side: THREE.DoubleSide,
        wireframe: true,
        flatShading: false
       // normalMap: new THREE.TextureLoader().load('./img/img3.jpg')
      });


    return (
        <>  
              {/* <EffectComposer autoClear={false}>
                 <Bloom ref={bloomRef}  intensity={0.05} luminanceSmoothing={0.5} luminanceThreshold={0.0} />  
                 {/* <ChromaticAberration offset={ new THREE.Vector2(0.0005, 0.0005) } /> 
              </EffectComposer>  */}

            <mesh
             ref={visualizerMesh}
             geometry={geometry}
            // rotation={[Math.PI * 1.6, 0, 0]}
            rotation={[Math.PI / 2, 0 , 0]} 
            >
                 <CustomShaderMaterial
                ref={visualizerMat}
                baseMaterial={cylinderMaterial}
                attach={"material"}
                vertexShader={CylinderVisualizerShaderMaterial.vertexShader}
                fragmentShader={CylinderVisualizerShaderMaterial.fragmentShader}
                uniforms={CylinderVisualizerShaderMaterial.uniforms}
                />
            </mesh>
        </>
      );
}


