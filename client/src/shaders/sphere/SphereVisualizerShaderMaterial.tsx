import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { DoubleSide } from "three";
import { sphereVertexShader } from "./sphere.vertex";
import { sphereFragmentShader } from "./sphere.fragment";

export const SphereVisualizerShaderMaterial = {
  side: DoubleSide,
  transparent: false,
  wireframe: false,

  uniforms: {
    uTime: {
      type: "f",
      value: 0,
    },
    uTime2: {
      type: "f",
      value: 0,
    },
    uColor1: {
      type: "v3",
      value: new THREE.Vector3(0.0, 0.4, 0.225),
    },
    rotationValue: {
      type: "f",
      value: 0,
    },
    progress: {
      type: "f",
      value: 0.0,
    },
    freqArray: {
      value: new Float32Array(),
    },
    waveArray: {
      value: new Float32Array(),
    },
    uVolume: {
      type: "f",
      value: 0,
    },
    uVolume2: {
      type: "f",
      value: 0,
    },
    uFrequency: {
      type: "f",
      value: 0,
    },
    uHighestFreq: {
      type: "f",
      value: 0,
    },
    uTexture: {
      type: "t",
      value: new TextureLoader().load("./img/img4.png"),
    },
    uTexture2: {
      type: "t",
      value: new TextureLoader().load("./img/img6.png"),
    },
  },
  vertexShader: sphereVertexShader,
  fragmentShader: sphereFragmentShader,
};

extend({ SphereVisualizerShaderMaterial });
