import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import CustomShaderMaterial from 'three-custom-shader-material'
import { NewSphereVisualizerShaderMaterial } from "../../shaders/newSphere/NewSphereVisualizerShaderMaterial";
import { Html } from "@react-three/drei";
import { Bloom, DepthOfField, EffectComposer, Sepia } from "@react-three/postprocessing";
import { getAverageAmplitudeForFrequencyRange } from "../../utils/audio";
import TorusVisualizer from "./TorusVisualizer";

let freqArray: Uint8Array,
  waveArray: Float32Array;

const setupAudioContext = (analyser: AnalyserNode) => {
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.85; // if the track is fast set it to 0.85 needs to be parameter
  freqArray = new Uint8Array(analyser.fftSize);
  waveArray = new Float32Array(analyser.fftSize);
};

export const Sphere = ({ currentAudioElement, sampleRate, analyser, cameraPos, detailLevel }: { currentAudioElement: HTMLAudioElement | null,sampleRate: number; analyser: AnalyserNode | null; cameraPos: THREE.Vector3, detailLevel: number; }) => {

  const visualizerMat = useRef<any>();
  const visualizerMesh = useRef<any>();
  const sepiaRef = useRef<any>();
  const bloomref = useRef<any>();
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

        visualizerMesh.current.material.uniforms.uFrequency.value =
        ( midrangeAverage + higherMidrangeAverage + presenceAverage +
        brillianceAverage) /
        1.0;

        visualizerMesh.current.material.uniforms.uVolume.value = volume;

        visualizerMesh.current.material.uniforms.uHighestFreq.value =
        (bassAverage + lowerMidrangeAverage) / 2.0;

        if (!currentAudioElement.paused) {

         // scene.rotation.y = -clock.getElapsedTime() * 0.25;
         // scene.position.y = Math.sin(clock.getElapsedTime() * 0.625) * 2.75;
         // camera.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 100;

         // visualizerMesh.current.rotation.y = clock.getElapsedTime() * 20.0;
         scene.position.y = (bassAverage + lowerMidrangeAverage) / 2.0;

        }



        if(sepiaRef.current && bloomref.current) {
          //sepiaRef.current.intensity = 1.0 - ((midrangeAverage + higherMidrangeAverage + presenceAverage + brillianceAverage) / 4.0);
          //sepiaRef.current.intensity = 2.0 - (bassAverage * 2.0);
          //bloomref.current.intensity = bassAverage / 2.0;
        }

      }
    }
  });


  const geometry = new THREE.IcosahedronGeometry(12.5, detailLevel);
  const geometryBig = new THREE.IcosahedronGeometry(500, detailLevel);

  const sphereMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1.0,
   // color: 'white',
    side: THREE.DoubleSide,
    wireframe: true,
   // flatShading: false,
    transparent: false,
    //blending: THREE.AdditiveBlending,
    //depthTest: false
   // normalMap: new THREE.TextureLoader().load('./img/img3.jpg')
  });

  const sphereOuterMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.0,
    metalness: 1.0,
    //color: 'blue',
   // map: new THREE.TextureLoader().load('./img/img1.jpg'),
    side: THREE.DoubleSide,
    wireframe: false
  });

  return (
    <>
     
      <mesh
        ref={visualizerMesh}
        rotation={[0, 0, 0]}
        geometry={geometry}
        visible={true}
        scale={[1, 1, 1]}
      >
        <CustomShaderMaterial
          ref={visualizerMat}
          baseMaterial={sphereMaterial}
          attach={"material"}
          vertexShader={NewSphereVisualizerShaderMaterial.vertexShader}
          fragmentShader={NewSphereVisualizerShaderMaterial.fragmentShader}
          uniforms={NewSphereVisualizerShaderMaterial.uniforms}
        />
        {/* <Html 
        occlude={visualizerMesh.current}
        center
        wrapperClass="text3D"
        position={[0, -50, 0]}
        >nebo.programming
        </Html> */}
      </mesh>

      <points
        ref={visualizerMesh}
        rotation={[0, 0, 0]}
        geometry={geometryBig}
        visible={false}
        scale={[1, 1, 1]}
      >
        <CustomShaderMaterial
          ref={visualizerMat}
          baseMaterial={sphereOuterMaterial}
          attach={"material"}
          vertexShader={NewSphereVisualizerShaderMaterial.vertexShader}
          fragmentShader={NewSphereVisualizerShaderMaterial.fragmentShader}
          uniforms={NewSphereVisualizerShaderMaterial.uniforms}
          
        />
      </points>

        <EffectComposer>
          <Sepia 
          ref={sepiaRef}
          intensity={0}
          />
          <Bloom
          luminanceThreshold={1}
          intensity={0}
          ref={bloomref} 
          />
        </EffectComposer>
    </>
  );
}
