import { useRef, useEffect } from 'react';

const VERTEX_SHADER = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uGridColor;
  uniform vec3 uGlowColor;
  uniform float uSpeed;
  uniform float uGridSize;
  uniform float uFade;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    
    // Create perspective transformation
    float perspective = 1.0 / (uv.y * 2.0 + 0.3);
    float xPos = (uv.x - 0.5) * perspective * 8.0;
    float zPos = perspective * 6.0 - uTime * uSpeed;
    
    // Grid lines
    float gridX = abs(fract(xPos * uGridSize) - 0.5);
    float gridZ = abs(fract(zPos * uGridSize) - 0.5);
    
    float lineX = smoothstep(0.02, 0.0, gridX);
    float lineZ = smoothstep(0.02, 0.0, gridZ);
    
    float grid = max(lineX, lineZ);
    
    // Fade with distance (perspective depth)
    float depthFade = smoothstep(0.0, uFade, uv.y);
    
    // Horizon glow
    float horizonGlow = exp(-pow((uv.y - 0.15) * 6.0, 2.0)) * 0.6;
    
    // Edge fade
    float edgeFade = smoothstep(0.0, 0.15, uv.x) * smoothstep(1.0, 0.85, uv.x);
    
    // Combine
    vec3 color = uGridColor * grid * depthFade * edgeFade * 0.7;
    color += uGlowColor * horizonGlow * edgeFade;
    
    // Scanline effect
    float scanline = sin(gl_FragCoord.y * 1.5) * 0.03 + 0.97;
    color *= scanline;
    
    // Top fade (fade to transparent at top)
    float topFade = smoothstep(0.0, 0.4, uv.y);
    float alpha = (grid * depthFade * edgeFade * 0.7 + horizonGlow * edgeFade) * topFade;
    
    gl_FragColor = vec4(color, alpha * 0.85);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
    : [0, 1, 0.25];
}

export default function PerspectiveGrid({
  gridColor = '#00ff41',
  glowColor = '#00f3ff',
  speed = 0.4,
  gridSize = 0.5,
  fade = 0.6,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
    });
    if (!gl) return;

    // Create program
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program));
      return;
    }

    // Full-screen quad
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniforms
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uTime = gl.getUniformLocation(program, 'uTime');
    const uGridColor = gl.getUniformLocation(program, 'uGridColor');
    const uGlowColor = gl.getUniformLocation(program, 'uGlowColor');
    const uSpeed = gl.getUniformLocation(program, 'uSpeed');
    const uGridSize = gl.getUniformLocation(program, 'uGridSize');
    const uFade = gl.getUniformLocation(program, 'uFade');

    const gridRgb = hexToRgb(gridColor);
    const glowRgb = hexToRgb(glowColor);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    window.addEventListener('resize', resize);

    let startTime = performance.now();

    function render() {
      const elapsed = (performance.now() - startTime) / 1000;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform3f(uGridColor, gridRgb[0], gridRgb[1], gridRgb[2]);
      gl.uniform3f(uGlowColor, glowRgb[0], glowRgb[1], glowRgb[2]);
      gl.uniform1f(uSpeed, speed);
      gl.uniform1f(uGridSize, gridSize);
      gl.uniform1f(uFade, fade);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animRef.current = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteBuffer(buffer);
    };
  }, [gridColor, glowColor, speed, gridSize, fade]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style,
      }}
    />
  );
}
