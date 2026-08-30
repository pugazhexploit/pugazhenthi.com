import { useRef, useEffect } from 'react';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  #ifdef GL_OES_standard_derivatives
  #extension GL_OES_standard_derivatives : enable
  #endif

  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uGridColor;
  uniform vec3 uGlowColor;
  uniform float uSpeed;
  uniform float uDensity;
  uniform float uHorizon;
  uniform float uIsDark;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    
    float horizon = uHorizon;
    float distFromHorizon = horizon - uv.y;
    
    // Horizon glow band
    float horizonGlow = exp(-abs(uv.y - horizon) * (uIsDark > 0.5 ? 25.0 : 35.0)) * (uIsDark > 0.5 ? 0.45 : 0.25);
    
    // Side vignetting
    float sideFade = smoothstep(0.0, 0.12, uv.x) * smoothstep(1.0, 0.88, uv.x);
    
    if (distFromHorizon <= 0.001) {
      // Above horizon - soft sky glow
      vec3 skyGlow = uGlowColor * horizonGlow * sideFade;
      float skyAlpha = horizonGlow * sideFade * (uIsDark > 0.5 ? 0.4 : 0.2);
      gl_FragColor = vec4(skyGlow, skyAlpha);
      return;
    }
    
    // 3D Ground Plane Perspective Projection
    float z = 1.0 / max(distFromHorizon, 0.001);
    float x = (uv.x - 0.5) * z * 0.95;
    float zScroll = z * 1.8 - uTime * uSpeed * 2.5;
    
    vec2 gridPos = vec2(x, zScroll) * uDensity;
    vec2 gridFract = abs(fract(gridPos - 0.5) - 0.5);
    
    // Crisp anti-aliased grid lines
    #if defined(GL_OES_standard_derivatives) || __VERSION__ >= 300
      vec2 fw = fwidth(gridPos);
      vec2 line = smoothstep(fw * 1.25, vec2(0.0), gridFract);
    #else
      vec2 line = smoothstep(vec2(0.035), vec2(0.0), gridFract);
    #endif
    
    float gridIntensity = max(line.x, line.y);
    
    // Distance fog: smoothly fade grid towards the horizon
    float depthFade = clamp(1.0 - (z - 1.0) / 22.0, 0.0, 1.0);
    depthFade = pow(depthFade, 1.4);
    
    // Bottom fade so it smoothly emerges
    float bottomFade = smoothstep(0.0, 0.1, uv.y);
    
    float totalGrid = gridIntensity * depthFade * bottomFade * sideFade;
    
    // Combine Grid and Horizon Glow
    vec3 color = uGridColor * totalGrid;
    color += uGlowColor * (horizonGlow * sideFade + totalGrid * (uIsDark > 0.5 ? 0.35 : 0.15));
    
    float alpha = clamp(totalGrid * (uIsDark > 0.5 ? 0.75 : 0.45) + horizonGlow * sideFade, 0.0, 0.9);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

function parseColor(colorStr) {
  if (colorStr.startsWith('#')) {
    const hex = colorStr.replace('#', '');
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255,
      ];
    }
    if (hex.length === 6) {
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
      ];
    }
  }
  return [0.0, 1.0, 0.25];
}

export default function PerspectiveGrid({
  speed = 0.35,
  density = 0.75,
  horizon = 0.72,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Try WebGL2 first, fallback to WebGL1 with OES_standard_derivatives
    let gl = canvas.getContext('webgl2', { alpha: true, antialias: true, premultipliedAlpha: false });
    let isWebGL2 = true;

    if (!gl) {
      gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: false });
      isWebGL2 = false;
      if (gl) {
        gl.getExtension('OES_standard_derivatives');
      }
    }

    if (!gl) return;

    // Compile Shaders
    function createShader(glCtx, type, source) {
      const shader = glCtx.createShader(type);
      glCtx.shaderSource(shader, source);
      glCtx.compileShader(shader);
      if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
        console.error('Shader error:', glCtx.getShaderInfoLog(shader));
        glCtx.deleteShader(shader);
        return null;
      }
      return shader;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program error:', gl.getProgramInfoLog(program));
      return;
    }

    // Geometry: Full-screen quad
    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uRes = gl.getUniformLocation(program, 'uResolution');
    const uT = gl.getUniformLocation(program, 'uTime');
    const uGColor = gl.getUniformLocation(program, 'uGridColor');
    const uGlColor = gl.getUniformLocation(program, 'uGlowColor');
    const uSpd = gl.getUniformLocation(program, 'uSpeed');
    const uDens = gl.getUniformLocation(program, 'uDensity');
    const uHor = gl.getUniformLocation(program, 'uHorizon');
    const uDark = gl.getUniformLocation(program, 'uIsDark');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let width = 0;
    let height = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.floor(rect.width * dpr);
      height = Math.floor(rect.height * dpr);

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    let animId;
    let startTime = performance.now();

    function render() {
      const elapsed = (performance.now() - startTime) / 1000;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      // Dynamic theme-adapted colors
      const gridHex = isDark ? '#00ff41' : '#009232';
      const glowHex = isDark ? '#00f3ff' : '#0284c7';
      const gridRgb = parseColor(gridHex);
      const glowRgb = parseColor(glowHex);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, elapsed);
      gl.uniform3f(uGColor, gridRgb[0], gridRgb[1], gridRgb[2]);
      gl.uniform3f(uGlColor, glowRgb[0], glowRgb[1], glowRgb[2]);
      gl.uniform1f(uSpd, speed);
      gl.uniform1f(uDens, density);
      gl.uniform1f(uHor, horizon);
      gl.uniform1f(uDark, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buffer);
    };
  }, [speed, density, horizon]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.85,
        ...style,
      }}
    />
  );
}
