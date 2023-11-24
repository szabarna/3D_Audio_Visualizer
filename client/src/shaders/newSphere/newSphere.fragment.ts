// @ts-ignore
import glsl from 'glslify';

  export const newSphereFragmentShader = glsl`
  
    varying vec2 vUv;
    varying vec3 vPosition;

    varying float vDist;

    uniform sampler2D uTexture;

   void main() {

  //  csm_FragColor = vec4(0.0, 0.0, 1.0, 1.0);
    vec4 tt = texture2D(uTexture, vUv + (vDist * 0.025));
    vec3 dark = vec3(vDist);
    vec3 mixed = mix(tt.rgb, -dark, -vDist);

    float disc = 1.0 - smoothstep(-0.2, 0.5, length(gl_PointCoord - vec2(0.5) ));
    csm_DiffuseColor.a = disc;
   // csm_DiffuseColor = tt * tt;
   //csm_FragColor.rgb = mixed * tt.rgb;
   // csm_DiffuseColor.rgb += tt.rgb;
    }
      `
 