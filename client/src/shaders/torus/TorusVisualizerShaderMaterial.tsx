import { extend } from "@react-three/fiber";
import { TextureLoader, Vector3 } from 'three'
import { DoubleSide } from "three";
import { AdditiveBlending } from "three";
import { torusVertexShader }  from './torus.vertex';
import { torusFragmentShader }  from './torus.fragment';

export const TorusVisualizerShaderMaterial:any = {

    side: DoubleSide,
    transparent: true,
    wireframe: true,
    

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
      value: new TextureLoader().load('./img/skull.jpg')
    },
    uTexture2: {
      type: "t",
      value: new TextureLoader().load('./img/planet.jpg')
    },
    uColor: {
      type: "v3",
      value: new Vector3(0.0, 1.0, 0.0)
    }
    
  },
  vertexShader: torusVertexShader
  ,
  fragmentShader: torusFragmentShader
};



extend({ TorusVisualizerShaderMaterial });
