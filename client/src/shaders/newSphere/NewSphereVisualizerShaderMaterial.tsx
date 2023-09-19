import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { DoubleSide } from "three";
import { newSphereVertexShader } from "./newSphere.vertex";
import { newSphereFragmentShader } from "./newSphere.fragment";

export const NewSphereVisualizerShaderMaterial = {
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
    progress: {
      type: "f",
      value: 0.0,
    },
    uVolume: {
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
      value: new TextureLoader().load("./img/img1.jpg"),
    },
    uTexture2: {
      type: "t",
      value: new TextureLoader().load("./img/img1.jpg"),
    },
  },
  vertexShader: newSphereVertexShader,
  fragmentShader: newSphereFragmentShader,
};

extend({ NewSphereVisualizerShaderMaterial });
