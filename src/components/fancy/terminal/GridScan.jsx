import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const frag = `
precision highp float;
uniform vec3 iResolution;
uniform float iTime;
uniform float uLineThickness;
uniform vec3 uLinesColor;
uniform vec3 uScanColor;
uniform float uGridScale;
uniform float uLineJitter;
uniform float uScanOpacity;
uniform float uScanGlow;
uniform float uScanSoftness;
uniform float uScanDuration;
uniform float uScanDelay;
uniform float uNoise;
varying vec2 vUv;

float smoother01(float a, float b, float x) {
  float t = clamp((x - a) / max(1e-5, (b - a)), 0.0, 1.0);
  return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 p = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  vec3 ro = vec3(0.0);
  vec3 rd = normalize(vec3(p, 2.0));
  vec3 color = vec3(0.0);

  float minT = 1e20;
  float gridScale = max(1e-5, uGridScale);
  vec2 gridUV = vec2(0.0);
  float hitIsY = 1.0;

  // Ray march against 4 planes: y = -0.2, y = 0.2, x = -0.5, x = 0.5
  for (int i = 0; i < 4; i++) {
    float isY = float(i < 2);
    float pos = mix(-0.2, 0.2, float(i)) * isY + mix(-0.5, 0.5, float(i - 2)) * (1.0 - isY);
    float num = pos - (isY * ro.y + (1.0 - isY) * ro.x);
    float den = isY * rd.y + (1.0 - isY) * rd.x;
    float t = num / den;
    vec3 h = ro + rd * t;
    bool use = t > 0.0 && t < minT;
    gridUV = use ? mix(h.zy, h.xz, isY) / gridScale : gridUV;
    minT = use ? t : minT;
    hitIsY = use ? isY : hitIsY;
  }

  vec3 hit = ro + rd * minT;
  float dist = length(hit - ro);

  // Jitter
  if (uLineJitter > 0.0) {
    vec2 j = vec2(
      sin(gridUV.y * 2.7 + iTime * 1.8),
      cos(gridUV.x * 2.3 - iTime * 1.6)
    ) * (0.15 * uLineJitter);
    gridUV += j;
  }

  float fx = fract(gridUV.x);
  float fy = fract(gridUV.y);
  float ax = min(fx, 1.0 - fx);
  float ay = min(fy, 1.0 - fy);
  float wx = fwidth(gridUV.x);
  float wy = fwidth(gridUV.y);
  float halfPx = max(0.0, uLineThickness) * 0.5;
  float tx = halfPx * wx;
  float ty = halfPx * wy;
  float lineX = 1.0 - smoothstep(tx, tx + wx, ax);
  float lineY = 1.0 - smoothstep(ty, ty + wy, ay);
  float primaryMask = max(lineX, lineY);

  // Second plane mask
  vec2 gridUV2 = (hitIsY > 0.5 ? hit.xz : hit.zy) / gridScale;
  if (uLineJitter > 0.0) {
    vec2 j2 = vec2(
      cos(gridUV2.y * 2.1 - iTime * 1.4),
      sin(gridUV2.x * 2.5 + iTime * 1.7)
    ) * (0.15 * uLineJitter);
    gridUV2 += j2;
  }
  float fx2 = fract(gridUV2.x);
  float fy2 = fract(gridUV2.y);
  float ax2 = min(fx2, 1.0 - fx2);
  float ay2 = min(fy2, 1.0 - fy2);
  float wx2 = fwidth(gridUV2.x);
  float wy2 = fwidth(gridUV2.y);
  float tx2 = halfPx * wx2;
  float ty2 = halfPx * wy2;
  float lineX2 = 1.0 - smoothstep(tx2, tx2 + wx2, ax2);
  float lineY2 = 1.0 - smoothstep(ty2, ty2 + wy2, ay2);
  float altMask = max(lineX2, lineY2);

  float edgeDistX = min(abs(hit.x - (-0.5)), abs(hit.x - 0.5));
  float edgeDistY = min(abs(hit.y - (-0.2)), abs(hit.y - 0.2));
  float edgeDist = mix(edgeDistY, edgeDistX, hitIsY);
  float edgeGate = 1.0 - smoothstep(gridScale * 0.5, gridScale * 2.0, edgeDist);
  altMask *= edgeGate;

  float lineMask = max(primaryMask, altMask);
  float fade = exp(-dist * 2.0);

  // Scan line with depth
  float dur = max(0.05, uScanDuration);
  float del = max(0.0, uScanDelay);
  float scanZMax = 2.0;
  float sigma = max(0.001, 0.18 * uScanGlow * uScanSoftness);
  float sigmaA = sigma * 2.0;

  float cycle = dur + del;
  float tCycle = mod(iTime, cycle);
  float phase = clamp((tCycle - del) / dur, 0.0, 1.0);
  // pingpong
  float t2 = mod(max(0.0, iTime - del), 2.0 * dur);
  phase = (t2 < dur) ? (t2 / dur) : (1.0 - (t2 - dur) / dur);

  float scanZ = phase * scanZMax;
  float dz = abs(hit.z - scanZ);
  float lineBand = exp(-0.5 * (dz * dz) / (sigma * sigma));
  float auraBand = exp(-0.5 * (dz * dz) / (sigmaA * sigmaA));

  float taper = 0.45;
  float headFade = smoother01(0.0, taper, phase);
  float tailFade = 1.0 - smoother01(1.0 - taper, 1.0, phase);
  float phaseWindow = headFade * tailFade;

  float combinedPulse = lineBand * phaseWindow * uScanOpacity;
  float combinedAura = auraBand * 0.25 * phaseWindow * uScanOpacity;

  float lineVis = lineMask;
  // Boost grid brightness x3 and reduce fade falloff
  float gridFade = exp(-dist * 0.8);
  vec3 gridCol = uLinesColor * lineVis * gridFade * 3.0;
  vec3 scanCol = uScanColor * (combinedPulse + combinedAura) * 1.5;

  color = gridCol + scanCol;

  float n = fract(sin(dot(gl_FragCoord.xy + vec2(iTime * 123.4), vec2(12.9898,78.233))) * 43758.5453123);
  color += (n - 0.5) * uNoise;

  float alpha = clamp(max(lineVis * gridFade * 0.8, combinedPulse), 0.0, 1.0);
  fragColor = vec4(color, alpha);
}

void main() {
  vec4 c;
  mainImage(c, vUv * iResolution.xy);
  gl_FragColor = c;
}
`;

function srgbColor(hex) {
  const c = new THREE.Color(hex);
  // Brighten dark colors for visibility
  c.r = Math.pow(c.r, 0.45);
  c.g = Math.pow(c.g, 0.45);
  c.b = Math.pow(c.b, 0.45);
  return c;
}

export default function GridScan({
  lineThickness = 1,
  linesColor = '#2F293A',
  scanColor = '#9eb2eb',
  scanOpacity = 0.4,
  gridScale = 0.1,
  lineJitter = 0.1,
  scanGlow = 0.5,
  scanSoftness = 2,
  scanDuration = 2,
  scanDelay = 2,
  noiseIntensity = 0.01,
  style,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const uniforms = {
      iResolution: { value: new THREE.Vector3(container.clientWidth, container.clientHeight, 1) },
      iTime: { value: 0 },
      uLineThickness: { value: lineThickness },
      uLinesColor: { value: srgbColor(linesColor) },
      uScanColor: { value: srgbColor(scanColor) },
      uGridScale: { value: gridScale },
      uLineJitter: { value: lineJitter },
      uScanOpacity: { value: scanOpacity },
      uScanGlow: { value: scanGlow },
      uScanSoftness: { value: scanSoftness },
      uScanDuration: { value: scanDuration },
      uScanDelay: { value: scanDelay },
      uNoise: { value: noiseIntensity },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vert,
      fragmentShader: frag,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    const onResize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight);
      uniforms.iResolution.value.set(container.clientWidth, container.clientHeight, 1);
    };
    window.addEventListener('resize', onResize);

    let raf;
    const tick = () => {
      uniforms.iTime.value = performance.now() / 1000;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      material.dispose();
      quad.geometry.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [lineThickness, linesColor, scanColor, scanOpacity, gridScale, lineJitter, scanGlow, scanSoftness, scanDuration, scanDelay, noiseIntensity]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'hidden', ...style }} />;
}
