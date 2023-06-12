import { extend } from "@react-three/fiber";
import { TextureLoader } from 'three'
import { DoubleSide } from "three";
import { AdditiveBlending } from "three";
import { fnafVertexShader }  from './fnaf.vertex';
import { fnafFragmentShader }  from './fnaf.fragment';

export const FNAFVisualizerShaderMaterial = {

    side: DoubleSide,
    transparent: false,
   // blend: AdditiveBlending,
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
      value: new TextureLoader().load('./img/try.jpg')
    },
    uTexture2: {
      type: "t",
      value: new TextureLoader().load('./img/planet.jpg')
    }
    
  },
  vertexShader: fnafVertexShader
  ,
  fragmentShader: fnafFragmentShader
};



extend({ FNAFVisualizerShaderMaterial });
