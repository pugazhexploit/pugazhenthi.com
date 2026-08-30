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
  uniform vec2 uCenter;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform float uRadius;
  uniform float uSpeed;
  uniform float uDensity;
  uniform float uSwirl;
  uniform float uIsDark;

  // 3D Value Noise for smooth organic fog
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0.0, 0.0, 0.0)), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
      mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
          mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y),
      f.z
    );
  }

  float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    mat3 rot = mat3(
      0.00,  0.80,  0.60,
     -0.80,  0.36, -0.48,
     -0.60, -0.48,  0.64
    );
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.02 + vec3(0.0, 0.0, 0.35);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    float aspect = uResolution.x / uResolution.y;
    
    // Centered coordinates respecting aspect ratio
    vec2 p = uv - uCenter;
    p.x *= aspect;
    
    float r = length(p);
    float R = uRadius;
    
    // Soft outer atmosphere falloff
    float aura = exp(-pow(r / max(R, 0.01), 2.2) * 2.8);
    
    // Spherical volume depth
    float h = 0.0;
    if (r < R) {
      h = sqrt(max(0.0, R * R - r * r)) / R;
    }
    
    // Vortex angle rotation for swirling effect
    float theta = atan(p.y, p.x);
    float swirlAmount = (1.0 - smoothstep(0.0, R * 1.5, r)) * uSwirl;
    float angle = theta + uTime * uSpeed * 0.6 + swirlAmount;
    vec2 pRot = vec2(cos(angle), sin(angle)) * r;
    
    // Sample domain-warped 3D fog volume
    vec3 pos = vec3(pRot * 3.2, h * 1.8) + vec3(0.0, 0.0, uTime * uSpeed * 0.4);
    
    float q1 = fbm(pos);
    float q2 = fbm(pos + vec3(4.3, 1.7, 2.8));
    vec3 warpedPos = pos + vec3(q1, q2, q1 * 0.5) * 1.35;
    
    float fogPattern = fbm(warpedPos);
    fogPattern = smoothstep(0.18, 0.85, fogPattern) * uDensity;
    
    // Volumetric density inside the sphere
    float sphereMask = smoothstep(R * 1.12, R * 0.7, r) * (h * 0.7 + 0.3);
    float coreFog = fogPattern * sphereMask;
    
    // Edge Fresnel rim lighting
    float rim = pow(1.0 - h, 2.2) * smoothstep(R * 1.15, R * 0.75, r) * 0.6;
    
    // Combine colors
    vec3 col = mix(uColor1, uColor2, fogPattern);
    col = mix(col, uColor3, rim + coreFog * 0.4);
    
    // Add external soft ethereal glow
    vec3 auraColor = mix(uColor1, uColor2, 0.5) * aura * (uIsDark > 0.5 ? 0.35 : 0.18);
    col += auraColor;
    
    // Calculate final alpha
    float baseAlpha = (coreFog * 0.85 + rim * 0.5 + aura * 0.35);
    float finalAlpha = clamp(baseAlpha * (uIsDark > 0.5 ? 0.65 : 0.38), 0.0, 0.88);
    
    gl_FragColor = vec4(col, finalAlpha);
  }
`;

function hexToVec3(hex) {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    return [
      parseInt(clean[0] + clean[0], 16) / 255,
      parseInt(clean[1] + clean[1], 16) / 255,
      parseInt(clean[2] + clean[2], 16) / 255,
    ];
  }
  if (clean.length === 6) {
    return [
      parseInt(clean.slice(0, 2), 16) / 255,
      parseInt(clean.slice(2, 4), 16) / 255,
      parseInt(clean.slice(4, 6), 16) / 255,
    ];
  }
  return [0.0, 1.0, 0.25];
}

export default function FogSphere({
  color1 = '#00ff41',
  color2 = '#00f3ff',
  color3 = '#80ffea',
  radius = 0.42,
  speed = 0.55,
  density = 1.15,
  swirl = 2.4,
  center = [0.65, 0.5],
  followMouse = true,
  mouseInfluence = 0.08,
  className = '',
  style = {},
}) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: center[0], y: center[1], targetX: center[0], targetY: center[1] });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    function createShader(glCtx, type, source) {
      const s = glCtx.createShader(type);
      glCtx.shaderSource(s, source);
      glCtx.compileShader(s);
      if (!glCtx.getShaderParameter(s, glCtx.COMPILE_STATUS)) {
        console.error('FogSphere shader error:', glCtx.getShaderInfoLog(s));
        glCtx.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('FogSphere program error:', gl.getProgramInfoLog(prog));
      return;
    }

    const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uResolution');
    const uT = gl.getUniformLocation(prog, 'uTime');
    const uCtr = gl.getUniformLocation(prog, 'uCenter');
    const uC1 = gl.getUniformLocation(prog, 'uColor1');
    const uC2 = gl.getUniformLocation(prog, 'uColor2');
    const uC3 = gl.getUniformLocation(prog, 'uColor3');
    const uRad = gl.getUniformLocation(prog, 'uRadius');
    const uSpd = gl.getUniformLocation(prog, 'uSpeed');
    const uDens = gl.getUniformLocation(prog, 'uDensity');
    const uSwl = gl.getUniformLocation(prog, 'uSwirl');
    const uDark = gl.getUniformLocation(prog, 'uIsDark');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.floor(rect.width * dpr);
      const h = Math.floor(rect.height * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    }

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      if (!followMouse) return;
      const rect = canvas.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width;
      const normY = 1.0 - (e.clientY - rect.top) / rect.height;
      mouseRef.current.targetX = center[0] + (normX - 0.5) * mouseInfluence;
      mouseRef.current.targetY = center[1] + (normY - 0.5) * mouseInfluence;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    let animId;
    let startTime = performance.now();

    function render() {
      const elapsed = (performance.now() - startTime) / 1000;
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';

      // Mouse smoothing
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      const c1 = isDark ? hexToVec3(color1) : hexToVec3('#059669');
      const c2 = isDark ? hexToVec3(color2) : hexToVec3('#0284c7');
      const c3 = isDark ? hexToVec3(color3) : hexToVec3('#34d399');

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uT, elapsed);
      gl.uniform2f(uCtr, mouseRef.current.x, mouseRef.current.y);
      gl.uniform3f(uC1, c1[0], c1[1], c1[2]);
      gl.uniform3f(uC2, c2[0], c2[1], c2[2]);
      gl.uniform3f(uC3, c3[0], c3[1], c3[2]);
      gl.uniform1f(uRad, radius);
      gl.uniform1f(uSpd, speed);
      gl.uniform1f(uDens, density);
      gl.uniform1f(uSwl, swirl);
      gl.uniform1f(uDark, isDark ? 1.0 : 0.0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animId = requestAnimationFrame(render);
    }

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animId) cancelAnimationFrame(animId);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [color1, color2, color3, radius, speed, density, swirl, center, followMouse, mouseInfluence]);

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
        ...style,
      }}
    />
  );
}
