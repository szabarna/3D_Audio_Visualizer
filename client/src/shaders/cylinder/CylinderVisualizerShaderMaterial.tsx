import { extend } from "@react-three/fiber";
import { TextureLoader } from 'three'
import { DoubleSide } from "three";
import { AdditiveBlending } from "three";
import { cylinderVertexShader }  from './cylinder.vertex';
import { cylinderFragmentShader }  from './cylinder.fragment';

export const CylinderVisualizerShaderMaterial = {

    side: DoubleSide,
    transparent: true,
    //blend: AdditiveBlending,
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
    }
    
  },
  vertexShader: cylinderVertexShader
  ,
  fragmentShader: cylinderFragmentShader
};



extend({ CylinderVisualizerShaderMaterial });
