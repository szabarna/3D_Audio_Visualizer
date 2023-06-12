import { extend } from "@react-three/fiber";
import { TextureLoader } from 'three'
import { DoubleSide } from "three";
import { AdditiveBlending } from "three";

export const VisualizerShaderMaterial2 = {

  side: DoubleSide,
    transparent: true,
    blend: AdditiveBlending,

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
    uTexture: {
      type: "t",
      value: new TextureLoader().load('./img/try.jpg')
    },
    uTexture2: {
      type: "t",
      value: new TextureLoader().load('./img/planet.jpg')
    }
    
  },
  vertexShader: /*glsl*/`
  float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
  }

  attribute float aRandom;
  attribute float displace;

   varying vec2 vUv;
   varying vec3 vNormal;
   varying vec3 vPosition;
   varying float vFreq;

   uniform float uTime2;
   uniform float progress;
   uniform float[64] freqArray;
   uniform float[64] waveArray;


   void main() {

      vUv = uv;
      vNormal = normal;
      vPosition = position;


      vec3 newPos = position + normal * (displace / 255.0) * 1.5;

      vFreq = displace / 255.0;

      vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.);

       gl_PointSize = 2.5;
       gl_Position = projectionMatrix * mvPosition;
       
   }
 `,
  fragmentShader: /*glsl*/`

   

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vFreq;

    uniform float uTime;
    uniform float progress;

   void main() {
      

      vec3 c1 = vec3(1.0, 0.0, 0.0);
      vec3 c2 = vec3(0.0, 1.0, 0.0);

      float disc = 1.0 - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(0.5) ));

     // gl_FragColor = vec4(vUv.xy, 1.0, disc);

     float steppedFreq = smoothstep(-0.25, 1.0, vFreq);
     vec3 mixed = mix(c1, c2, steppedFreq);

    // Typical 2D frequency visualization
    // float dist = 1.0 - smoothstep(0.0, 0.5, length(vUv - vec2(0.5) * 2.0));
    // float dist2 = 1.0 - smoothstep(0.0, 0.25, length(vUv - vec2(0.5) * 2.0));

    // TWO SIDED 2D frequency visualization
    float dist = 1.0 - smoothstep(0.05, 0.5, length(vUv - vec2(0.5)));
    float dist2 = 1.0 - smoothstep(0.25, 0.25, length(vUv - vec2(0.5)));


     vec3 mixed2 = mix(c1, c2, dist);

     gl_FragColor = vec4(mixed2, disc);
    // gl_FragColor.rgb += mixed2 * 0.25;


   }
 `
};



extend({ VisualizerShaderMaterial2 });
