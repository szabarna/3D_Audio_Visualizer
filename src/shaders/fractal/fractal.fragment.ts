// @ts-ignore
import glsl from 'glslify';

  export const fractalFragmentShader = glsl`
  
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vColor;
    varying float vFreq;

    uniform float uTime;
    uniform float progress;
    uniform vec2 res;
    uniform float aspect;
    uniform float zoom;
    uniform vec2 offset;
    uniform sampler2D uTexture;
    uniform float uFrequency;
    uniform float uHighestFreq;
    uniform float uVolume;

    uniform vec3 pset1;
    uniform vec3 pset2;
    
    vec2 cm (vec2 a, vec2 b){
      return vec2(a.x*b.x - a.y*b.y, a.x*b.y + b.x*a.y);
    }
    vec2 conj (vec2 a){
      return vec2(a.x, -a.y);
    }

    float mandelbrot(vec2 c){

      vec3 newPset1 = pset1;
      vec3 newPset2 = pset2;
      // newPset1.xyz += vec3(pset2.z + sin(uTime * 1.0) * 0.05);
      // newPset2.xyz += vec3(pset1.z + cos(uTime * 1.0) * 0.05);

     // newPset1.xyz += vec3(pset2.y * (sin(uTime) * 0.5) + uFrequency * 1.5 );
      newPset1.y -= uFrequency * 1.0;
      newPset1.z += uFrequency * 1.0;
      newPset1.x += uHighestFreq * 0.25;
      newPset1.xyz += cos(uTime) * 0.05;
      newPset2.xyz += vec3(pset1.z + uFrequency * 0.1);

     // newPset2.y -= uFrequency * 2.0;
     // newPset2.z += uVolume * 1.0;
     // newPset2.x += uHighestFreq * 0.25;

      float alpha = 1.0;
      vec2 z = vec2(0.0 , 0.0);
      vec2 z_0;
      vec2 z_1;
      vec2 z_2;
      for(int i=0; i < 180; i++){  // i < max iterations
        z_2 = z_1;
        z_1 = z_0;
        z_0 = z;
        float x_0_sq = z_0.x*z_0.x;
        float y_0_sq = z_0.y*z_0.y;
        vec2 z_0_sq = vec2(x_0_sq - y_0_sq, 2.0*z_0.x*z_0.y);
        float x_1_sq = z_1.x*z_1.x;
        float y_1_sq = z_1.y*z_1.y;
        vec2 z_1_sq = vec2(x_1_sq - y_1_sq, 2.0*z_1.x*z_1.y);

        // the recurrence equation
        z = newPset1.x*z_0_sq + c + newPset1.y*z_1_sq
        + newPset1.z*cm(z_1_sq, z_2) + newPset2.x*cm(z_1_sq, z_0)
        + newPset2.y*cm(z_2, z_0) + newPset2.z*cm(z_1, z_2);

        float z_0_mag = x_0_sq + y_0_sq;
        float z_1_mag = x_1_sq + y_1_sq;

        if(z_0_mag > 12.0){
          float frac = (12.0 - z_1_mag) / (z_0_mag - z_1_mag);
         
          alpha = (float(i) - 1.0 + frac)/180.0; // should be same as max iterations
          
          break;
        }
      }
  
      return alpha;
    }

    mat2 rotate2D(float angle) {
      return mat2(
          cos(angle), -sin(angle),
          sin(angle), cos(angle)
      );
  }
    
    void main(){ 
        vec2 uv = zoom * vec2(aspect, 1.0) * gl_FragCoord.xy / res + offset;
        vec2 uv2 = zoom * vec2(aspect, 1.0) * gl_FragCoord.xy / res + offset;
        uv.y -= 0.2;
        uv.x -= 2.0;
        uv *= 0.25;
        uv2.y -= 0.2;
        uv2.x -= 2.0;
        uv2 *= 0.25;
       // uv *= rotate2D(1.55);
        float s = 1.0 - mandelbrot(uv);
        float s2 = 1.0 - mandelbrot(uv2);
        vec3 coord = vec3(s, s, s);
        vec3 coord2 = vec3(s2, s2, s2);
        vec3 color = vec3(1.38, 50.5, 10.0);
        vec3 color2 = vec3(1.0, 10.38, 8.0);
        
        vec3 finalColor = mix(color, color2, s);
        vec3 finalColor2 = mix(color, color2, s2);

        vec3 finalFinalColor = mix(finalColor, finalColor2, vColor.r);
      
     // vec3 fractalTexture = texture2D(uTexture, vec2(s * s2, 0.5)).rgb;
      // smoothstep(0.01, s + 0.5
     // gl_FragColor = vec4(pow(coord * 1.05, finalColor), 1.0);
      gl_FragColor = vec4(pow(coord2 * 1.025, finalFinalColor), 1.0);

        if(gl_FragColor.r > 0.3 && gl_FragColor.g > 0.3 && gl_FragColor.b > 0.3) discard;
        //if(gl_FragColor.r < 0.1 && gl_FragColor.g < 0.1 && gl_FragColor.b < 0.1) discard;

     
    }
      `
 