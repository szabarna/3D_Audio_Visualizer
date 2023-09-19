import { extend } from "@react-three/fiber";
import * as THREE from "three";
import { TextureLoader } from "three";
import { DoubleSide } from "three";

import { sphereBgVertex } from "./sphere_bg.vertex";
import { sphereBgFragment } from "./sphere_bg.fragment";

export const SphereBackgroundShaderMaterial = {
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
      // new THREE.Vector3(0.0, 0.4, 0.225)
    },
    progress: {
      type: "f",
      value: 0.0,
    },
    uTexture: {
      type: "t",
      value: new TextureLoader().load("./img/preset1.jpeg"),
    },
    uTexture2: {
      type: "t",
      value: new TextureLoader().load("./img/turqiouse.jpg"),
    },
  },
  vertexShader: sphereBgVertex,
  fragmentShader: sphereBgFragment,
};

extend({ SphereBackgroundShaderMaterial });
