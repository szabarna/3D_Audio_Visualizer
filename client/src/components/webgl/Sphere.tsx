import * as THREE from "three";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import CustomShaderMaterial from 'three-custom-shader-material'
import { NewSphereVisualizerShaderMaterial } from "../../shaders/newSphere/NewSphereVisualizerShaderMaterial";

let audioContext: AudioContext = new window.AudioContext();
let source,
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


export default function Sphere(props: any) {

  const visualizerMat = useRef<any>();
  const visualizerMesh = useRef<any>();
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

      console.log(audioContext)
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

          scene.rotation.y = -clock.getElapsedTime() * 0.25;
          scene.position.y = Math.sin(clock.getElapsedTime() * 0.625) * 2.75;

          visualizerMesh.current.rotation.y = clock.getElapsedTime() * 20.0;

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

  const details = props.detailLevel;

  const geometry = new THREE.IcosahedronGeometry(12.5, details);
  const geometryBig = new THREE.IcosahedronGeometry(100, details);

  const sphereMaterial = new THREE.MeshStandardMaterial({
    roughness: 0.0,
    metalness: 1.0,
    color: 'white',
    side: THREE.DoubleSide,
    wireframe: false,
   // normalMap: new THREE.TextureLoader().load('./img/img3.jpg')
  });

  const sphereOuterMaterial = new THREE.MeshStandardMaterial({
    roughness: 1.0,
    metalness: 1.0,
    //color: 'blue',
    map: new THREE.TextureLoader().load('./img/img1.jpg'),
    side: THREE.DoubleSide
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
      </mesh>

      <mesh
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
      </mesh>


    </>
  );
}
