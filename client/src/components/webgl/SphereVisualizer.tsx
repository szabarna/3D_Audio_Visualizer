import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { SphereVisualizerShaderMaterial } from "../../shaders/sphere/SphereVisualizerShaderMaterial";
import {
  EffectComposer,
  Vignette,
} from "@react-three/postprocessing";
import { SphereBackgroundShaderMaterial } from "../../shaders/sphere_background/SphereBackgroundShaderMaterial";

let audioContext: AudioContext,
  source,
  analyser: AnalyserNode,
  freqArray: Uint8Array,
  waveArray: Float32Array;

const play = () => {
  console.log("im playing");
};

function getAverageAmplitudeForFrequencyRange(
  freqArray: Uint8Array,
  sampleRate: number,
  fftSize: number,
  minFrequency: number,
  maxFrequency: number
) {
  const indexMin = Math.round(minFrequency * (fftSize / sampleRate));
  const indexMax = Math.round(maxFrequency * (fftSize / sampleRate));
  const valuesInFrequencyRange = freqArray.slice(indexMin, indexMax);

  const sum = valuesInFrequencyRange.reduce((acc, val) => acc + val, 0);
  return sum / valuesInFrequencyRange.length / 255;
}

const setupAudioContext = (audioElement: HTMLAudioElement) => {
  audioContext = new window.AudioContext();
  source = audioContext.createMediaElementSource(
    audioElement as HTMLAudioElement
  );
  analyser = audioContext.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 2048;
  analyser.smoothingTimeConstant = 0.8;
  freqArray = new Uint8Array(analyser.fftSize);
  console.log(freqArray.length);
  waveArray = new Float32Array(analyser.fftSize);
  (audioElement as HTMLAudioElement).volume = 0.1;
};

// const setupAudioContextWithMicrophone = () => {
//   audioContext = new AudioContext();
//   analyser = audioContext.createAnalyser();
//   analyser.connect(audioContext.destination);
//   analyser.fftSize = 4096;
//   analyser.smoothingTimeConstant = 0.8;
//   freqArray = new Uint8Array(analyser.fftSize);
//   waveArray = new Float32Array(analyser.fftSize);
//   console.log(freqArray.length);

//   navigator.mediaDevices
//     .getUserMedia({ audio: true })
//     .then((stream) => {
//       // Create a media stream source and connect it to the analyzer node
//       const source = audioContext.createMediaStreamSource(stream);
//       source.connect(analyser);
//     })
//     .catch((error) => {
//       console.log("Error getting user media:", error);
//     });
// };

export default function SphereVisualizer(props: any) {

  const visualizerMat = useRef<any>();
  const visualizerMat2 = useRef<any>();
  const visualizerMesh = useRef<any>();
  const composer = useRef<any>();
  const audioElement = document.getElementById("audio") as HTMLAudioElement;
  const { scene, camera } = useThree();

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "p") {
      if (!audioElement.paused) audioElement.pause();
      else audioElement.play();
    }
  };

  useEffect(() => {
    // setupAudioContextWithMicrophone();
    window.addEventListener("keydown", onKeyDown);

    camera.position.copy(props.cameraPos);


    if (audioElement) {
      setupAudioContext(audioElement);
      audioElement.onplay = play;
    }

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  useFrame(({ clock }) => {
 
    if (analyser && freqArray && visualizerMat) {

      analyser.getByteFrequencyData(freqArray);

      const sampleRate = audioContext.sampleRate;
      const fftSize = analyser.fftSize;

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

        if (!audioElement.paused) {

          scene.rotation.y = -clock.getElapsedTime() * 0.15;
          scene.position.y = Math.sin(clock.getElapsedTime() * 0.625) * 2.75;

        }

        visualizerMesh.current.material.uniforms.uFrequency.value =
          (lowerMidrangeAverage * 0.15 +
          midrangeAverage +
          higherMidrangeAverage * 0.25 +
          presenceAverage * 0.35 +
          brillianceAverage * 0.5) /
          0.85;

        // bloomRef.current.intensity = (bassAverage) / 4.0;

        // music volume to uniform
        visualizerMesh.current.material.uniforms.uVolume.value = volume;

        // highest freq to uniform
        visualizerMesh.current.material.uniforms.uHighestFreq.value =
        bassAverage + 1.0 * lowerMidrangeAverage;

        visualizerMesh.current.geometry.attributes.position.needsUpdate = true;
        visualizerMesh.current.material.uniforms.uTime = clock.getElapsedTime();
      }
    }
  });

  const details = props.detailLevel;

  const geometry = new THREE.IcosahedronGeometry(12.5, 16);
  const geometryBig = new THREE.IcosahedronGeometry(
    7.5,
    details
  );
  const geometryBiggest = new THREE.IcosahedronGeometry(200, 32);

   let len = geometryBig.attributes.position.count;

   let randoms = new Float32Array(len * 3);

   for (let i = 0; i < len; i += 3) {
     let r = Math.random() * 5.5;

     randoms[i] = r;
     randoms[i + 1] = r;
     randoms[i + 2] = r;
   }

   geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
   geometryBig.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  return (
    <>
      <EffectComposer ref={composer} autoClear={false}>
      
        {/* <Bloom luminanceThreshold={0.0} intensity={0.5} luminanceSmoothing={1.0} width={1920} height={1080} resolutionX={1920} resolutionY={1080}  /> */}
        <Vignette />
      </EffectComposer>
      <mesh
        ref={visualizerMesh}
        // rotation={[Math.PI * 1.6, 0, 0]}
        rotation={[0, 0, 0]}
        geometry={geometry}
        visible={false}
        scale={[1, 1, 1]}
      >
        <shaderMaterial
          ref={visualizerMat}
          attach={"material"}
          args={[SphereVisualizerShaderMaterial]}
        />
      </mesh>
      <mesh
        ref={visualizerMesh}
        // rotation={[Math.PI * 1.6, 0, 0]}
        rotation={[0, 0, 0]}
        geometry={geometryBig}
        visible={true}
        scale={[1, 1, 1]}
      >
        <shaderMaterial
          ref={visualizerMat2}
          attach={"material"}
          args={[SphereVisualizerShaderMaterial]}
        />
      </mesh>

      <mesh
        
        // rotation={[Math.PI * 1.6, 0, 0]}
        rotation={[0, Math.PI * -0.5, 0]}
        geometry={geometryBiggest}
        visible={false}
        scale={[1.25, 1.25, 1.25]}
      >
        <shaderMaterial
          ref={visualizerMat}
          attach={"material"}
          args={[SphereBackgroundShaderMaterial]}
        />
      </mesh>
    </>
  );
}
