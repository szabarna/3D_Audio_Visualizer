import { extend } from "@react-three/fiber";
import { TextureLoader } from 'three'
import { DoubleSide } from "three";
import { AdditiveBlending } from "three";
import { fractalVertexShader }  from './fractal.vertex';
import { fractalFragmentShader }  from './fractal.fragment';
import * as THREE from 'three';

export const FractalVisualizerShaderMaterial = {

    side: DoubleSide,
    transparent: true,
    wireframe: false,

  uniforms: {
     uTime: {
        type: "f",
        value: 0
     },
     uTime2: {
      type: "f",
      value: 0
   },
    progress: {
      type: "f",
      value: 0.0
    },
    freqArray: {
      value: new Uint8Array()
    },
    waveArray: {
      value: new Uint8Array()
    },
    uVolume: {
      type: "f",
      value: 0
    },
    uVolume2: {
      type: "f",
      value: 0
    },
    uFrequency: {
      type: "f",
      value: 0
    },
    uHighestFreq: {
      type: "f",
      value: 0
    },
    uTexture: {
      type: "t",
      value: new TextureLoader().load('./img/immerse.jpg')
    },
    uTexture2: {
      type: "t",
      value: new TextureLoader().load('./img/planet.jpg')
    },
      res: {
        value: new THREE.Vector2( window.innerWidth, window.innerHeight),

      },
      aspect: {
        value: (window.innerWidth / window.innerHeight)
      },
      zoom: {
        value: 4.25,
      },
      offset: {
        value: new THREE.Vector2(-2.0*(window.innerWidth / window.innerHeight), -2.0),
      },
      pset1: {
        value: new THREE.Vector3(1.0, 1.0, 0.0),
      },
      pset2: {
        value: new THREE.Vector3(1.0, -0.5, -0.5),
      },
    
  },
  vertexShader: fractalVertexShader
  ,
  fragmentShader: fractalFragmentShader
};



extend({ FractalVisualizerShaderMaterial });
