import React, { useRef, useMemo, useState, useEffect, Suspense, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Error boundary to gracefully catch any WebGL or texture loader exceptions
class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("WebGL Gallery error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// Custom Cloth Simulation Shader Material (matching the exact video cloth wave & curvature)
const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: `
      uniform float scrollForce;
      uniform float time;
      uniform float isHovered;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vUv = uv;
        vNormal = normal;
        
        vec3 pos = position;
        
        // Dynamic curving based on scroll velocity
        float curveIntensity = scrollForce * 0.14;
        float distanceFromCenter = length(pos.xy);
        float curve = distanceFromCenter * distanceFromCenter * curveIntensity;
        
        // Gentle continuous cloth wave ripples
        float ripple1 = sin(pos.x * 2.2 + time * 2.4 + scrollForce * 1.2) * 0.03;
        float ripple2 = cos(pos.y * 2.6 + time * 1.8) * 0.024;
        float clothEffect = (ripple1 + ripple2) * (0.5 + abs(curveIntensity) * 1.0);
        
        // Flag flutter wave on hover
        float flagWave = 0.0;
        if (isHovered > 0.01) {
          float wavePhase = pos.x * 4.0 + time * 7.5;
          float dampening = smoothstep(-0.5, 0.5, pos.x);
          flagWave = sin(wavePhase) * 0.07 * dampening * isHovered;
        }
        
        pos.z -= (curve + clothEffect + flagWave);
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D map;
      uniform float opacity;
      uniform float blurAmount;
      uniform float isHovered;
      varying vec2 vUv;
      
      void main() {
        vec4 color = texture2D(map, vUv);
        
        // Fast 5-tap depth blur
        if (blurAmount > 0.05) {
          float blur = blurAmount * 0.0025;
          vec4 sum = color * 0.36;
          sum += texture2D(map, vUv + vec2(blur, blur)) * 0.16;
          sum += texture2D(map, vUv + vec2(-blur, -blur)) * 0.16;
          sum += texture2D(map, vUv + vec2(blur, -blur)) * 0.16;
          sum += texture2D(map, vUv + vec2(-blur, blur)) * 0.16;
          color = sum;
        }
        
        // Subtle specular sheen on hover
        if (isHovered > 0.01) {
          float edgeGlow = (1.0 - length(vUv - vec2(0.5))) * 0.25 * isHovered;
          color.rgb += vec3(edgeGlow);
        }
        
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `,
  });
};

function ImagePlane({ 
  planeIndex, 
  planesData, 
  texture, 
  material, 
  onClick 
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (material && texture) {
      material.uniforms.map.value = texture;
    }
  }, [material, texture]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const plane = planesData.current[planeIndex];
    if (!plane) return;

    // Direct mesh position update at 60 FPS
    meshRef.current.position.set(plane.x, plane.y, plane.z);

    // Natural subtle rotation based on horizontal position
    meshRef.current.rotation.z = plane.x * 0.025;
    meshRef.current.rotation.y = -(plane.x * 0.04);

    // Only visible when in front of camera lens to avoid blocking raycasts when behind
    meshRef.current.visible = plane.z < 1.0 && plane.z > -55;

    // Hover lerp
    if (material && material.uniforms) {
      const targetHover = hovered ? 1.0 : 0.0;
      material.uniforms.isHovered.value += (targetHover - material.uniforms.isHovered.value) * Math.min(1, delta * 8);
    }
  });

  const aspect = texture?.image ? texture.image.width / texture.image.height : 0.72;
  const scale = [2.8 * aspect, 2.8, 1];

  return (
    <mesh
      ref={meshRef}
      scale={scale}
      material={material}
      onClick={onClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function GalleryScene({
  images,
  scrollProgress = 0,
  onSelectImage,
  onActiveIndexChange,
}) {
  const currentVirtualIndex = useRef(0);
  const targetVirtualIndex = useRef(0);

  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === 'string' ? { src: img, alt: '' } : img
      ),
    [images]
  );

  const totalImages = normalizedImages.length; // Exactly 6 projects
  targetVirtualIndex.current = scrollProgress * Math.max(1, totalImages - 1);

  const imageSrcs = useMemo(() => normalizedImages.map((img) => img.src), [normalizedImages]);
  const textures = useTexture(imageSrcs);

  // Pool of custom cloth shader materials (1 per project)
  const materials = useMemo(
    () => Array.from({ length: totalImages }, () => createClothMaterial()),
    [totalImages]
  );

  // Balanced 3D corridor positions for the 6 projects
  const SPATIAL_POSITIONS = useMemo(() => [
    { x: -0.75, y: 0.15 },  // 0: ResQ Meal (center-left)
    { x: 0.85, y: -0.15 },  // 1: EV - Exam Vault (center-right)
    { x: -0.1, y: 0.22 },   // 2: Employee Tracker (center-high)
    { x: -0.95, y: -0.2 },  // 3: AWS Cloud (left-low)
    { x: 0.9, y: 0.2 },     // 4: Gemini AI (right-high)
    { x: 0.0, y: 0.0 },     // 5: Flutter UX (dead center finale)
  ], []);

  const focalZ = -12;
  const planeSpacing = 11;

  // Initialize plane data for each of the 6 projects
  const planesData = useRef(
    Array.from({ length: totalImages }, (_, i) => ({
      index: i,
      imageIndex: i,
      x: SPATIAL_POSITIONS[i % SPATIAL_POSITIONS.length].x,
      y: SPATIAL_POSITIONS[i % SPATIAL_POSITIONS.length].y,
      z: focalZ - i * planeSpacing,
    }))
  );

  // 60 FPS High-Performance Three.js Render Loop synced strictly to scroll progress
  useFrame((state, delta) => {
    // Smooth lerp towards scroll progress
    const prevVirtual = currentVirtualIndex.current;
    currentVirtualIndex.current += (targetVirtualIndex.current - currentVirtualIndex.current) * Math.min(1, delta * 9);
    
    // Virtual velocity for cloth flutter physics
    const scrollForce = (targetVirtualIndex.current - prevVirtual) * 6.0;

    const time = state.clock.getElapsedTime();

    materials.forEach((material) => {
      if (material && material.uniforms) {
        material.uniforms.time.value = time;
        material.uniforms.scrollForce.value = scrollForce;
      }
    });

    const currentV = currentVirtualIndex.current;

    planesData.current.forEach((plane, i) => {
      // offset is 0 when this project is in focal view
      // offset < 0 when project is queued in background
      // offset > 0 when project has moved past camera
      const offset = currentV - i;
      plane.z = focalZ + offset * planeSpacing;

      const basePos = SPATIAL_POSITIONS[i % SPATIAL_POSITIONS.length];
      plane.x = basePos.x;
      plane.y = basePos.y;

      // Opacity calculation:
      // In focus around focalZ (-16 to -8): opacity = 1.0
      // Flying past camera (z > -4): fade out smoothly to 0 at z = 1
      // Deep in background (z < -30): fade in smoothly from 0
      let opacity = 1.0;
      if (plane.z > -4) {
        opacity = Math.max(0, 1.0 - (plane.z - (-4)) / 5);
      } else if (plane.z < -30) {
        opacity = Math.max(0, 1.0 - ((-30) - plane.z) / 14);
      }

      // Depth blur:
      let blur = 0.0;
      if (plane.z < -16) {
        blur = Math.min(4.0, ((-16) - plane.z) * 0.2);
      } else if (plane.z > -6) {
        blur = Math.min(2.5, (plane.z - (-6)) * 0.35);
      }

      const material = materials[i];
      if (material && material.uniforms) {
        material.uniforms.opacity.value = opacity;
        material.uniforms.blurAmount.value = blur;
      }
    });

    // Notify active index change based on closest plane to focus
    const nearestIndex = Math.min(totalImages - 1, Math.max(0, Math.round(currentV)));
    if (onActiveIndexChange) {
      onActiveIndexChange(nearestIndex);
    }
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => {
        const texture = Array.isArray(textures) ? textures[plane.imageIndex] : textures;
        const material = materials[i];

        if (!texture || !material) return null;

        return (
          <ImagePlane
            key={plane.index}
            planeIndex={i}
            planesData={planesData}
            texture={texture}
            material={material}
            onClick={() => onSelectImage && onSelectImage(plane.imageIndex)}
          />
        );
      })}
    </>
  );
}

// Fallback grid if WebGL is unavailable
function FallbackGallery({ images, activeIndex = 0, onSelectImage }) {
  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === 'string' ? { src: img, alt: '' } : img
      ),
    [images]
  );

  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-[#050505] p-6 text-white">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-4xl w-full">
        {normalizedImages.map((img, i) => (
          <div 
            key={i} 
            onClick={() => onSelectImage && onSelectImage(i)}
            className={`group relative rounded-2xl overflow-hidden border transition-all cursor-pointer ${
              i === activeIndex 
                ? 'border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.5)] scale-105' 
                : 'border-white/15 bg-black/60 opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={img.src || '/placeholder.svg'}
              alt={img.alt || `Project ${i + 1}`}
              className="w-full h-44 object-cover filter grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex items-end p-3">
              <span className="font-mono text-xs text-white font-bold uppercase">{img.alt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InfiniteGallery({
  images,
  className = 'h-screen w-full',
  style,
  scrollProgress = 0,
  activeIndex = 0,
  onSelectImage,
  onActiveIndexChange,
}) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  const fallbackUI = (
    <FallbackGallery 
      images={images} 
      activeIndex={activeIndex}
      onSelectImage={onSelectImage} 
    />
  );

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        {fallbackUI}
      </div>
    );
  }

  return (
    <div className={`infinite-gallery-canvas ${className}`} style={style}>
      <WebGLErrorBoundary fallback={fallbackUI}>
        <Canvas
          camera={{ position: [0, 0, 0], fov: 55, near: 0.1, far: 100 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <GalleryScene
              images={images}
              scrollProgress={scrollProgress}
              onSelectImage={onSelectImage}
              onActiveIndexChange={onActiveIndexChange}
            />
          </Suspense>
        </Canvas>
      </WebGLErrorBoundary>
    </div>
  );
}
