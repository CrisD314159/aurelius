import { useRef, useEffect, FC, useState } from 'react';
import * as THREE from 'three';
import {motion} from 'motion/react'

const vertexShader = /* glsl */ `
varying vec2 v_texcoord;
void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    v_texcoord = uv;
}
`;

const fragmentShader = /* glsl */ `
varying vec2 v_texcoord;

uniform vec2 u_mouse;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_time;
uniform vec3 u_color;
uniform vec3 u_color2;
uniform float u_isPlaying;

uniform float u_shapeSize;
uniform float u_roundness;
uniform float u_borderSize;
uniform float u_circleSize;
uniform float u_circleEdge;

#ifndef PI
#define PI 3.1415926535897932384626433832795
#endif

#ifndef FNC_COORD
#define FNC_COORD
vec2 coord(in vec2 p) {
    p = p / u_resolution.xy;
    if (u_resolution.x > u_resolution.y) {
        p.x *= u_resolution.x / u_resolution.y;
        p.x += (u_resolution.y - u_resolution.x) / u_resolution.y / 2.0;
    } else {
        p.y *= u_resolution.y / u_resolution.x;
        p.y += (u_resolution.x - u_resolution.y) / u_resolution.x / 2.0;
    }
    p -= 0.5;
    p *= vec2(-1.0, 1.0);
    return p;
}
#endif

#define st0 coord(gl_FragCoord.xy)
#define mx coord(u_mouse * u_pixelRatio)

float sdCircle(in vec2 st, in vec2 center) {
    return length(st - center) * 2.0;
}

float aastep(float threshold, float value) {
    float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
    return smoothstep(threshold - afwidth, threshold + afwidth, value);
}

float fill(float x, float size, float edge) {
    return 1.0 - smoothstep(size - edge, size + edge, x);
}

void main() {
    vec2 st = st0 + 0.5;
    vec2 posMouse = mx * vec2(1., -1.) + 0.5;

    float sdfCircle = fill(
        sdCircle(st, posMouse),
        u_circleSize,
        u_circleEdge
    );

    float sdf = sdCircle(st, vec2(0.5));
    
    if (u_isPlaying > 0.5) {
        // Playing state: Animated sound wave ripples
        vec2 center = st - vec2(0.5);
        float dist = length(center);
        float angle = atan(center.y, center.x);
        
        // Multiple expanding rings with different speeds
        float wave1 = sin(dist * 20.0 - u_time * 4.0) * 0.5 + 0.5;
        float wave2 = sin(dist * 15.0 - u_time * 3.0 + PI) * 0.5 + 0.5;
        float wave3 = sin(dist * 25.0 - u_time * 5.0) * 0.5 + 0.5;
        
        // Rotating angular segments for spectrum effect
        float segments = sin(angle * 8.0 + u_time * 2.0) * 0.5 + 0.5;
        
        // Combine waves
        float waves = (wave1 + wave2 + wave3) / 3.0;
        waves *= segments;
        
        // Base circle shape
        float baseShape = fill(sdf, u_shapeSize, 0.3);
        
        // Apply wave pattern
        float result = baseShape * (0.3 + waves * 0.7);
        
        // Color modulation for spectrum effect
        vec3 playColor = mix(u_color, u_color2, waves);
        playColor += vec3(waves * 0.3);
        
        gl_FragColor = vec4(playColor, result);
    } else {
        // Recording/Idle state
        float pulse1 = sin(u_time * 2.5) * 0.04;
        float pulse2 = sin(u_time * 4.0) * 0.02;
        float pulse = pulse1 + pulse2;
        
        float activeSize = u_shapeSize + (u_time > 0.0 ? pulse : 0.0);
        
        float result = fill(sdf, activeSize, sdfCircle) * 1.2;
        
        float gradient = 1.0 - length(st - vec2(0.5)) * 1.2;
        gradient = smoothstep(0.2, 1.0, gradient);
        
        vec3 finalColor = mix(u_color, u_color2, gradient * 0.5);
        
        vec2 highlightPos = st - vec2(0.35, 0.35);
        float highlight = exp(-dot(highlightPos, highlightPos) * 8.0) * 0.6;
        finalColor += vec3(highlight);

        gl_FragColor = vec4(finalColor, result);
    }
}
`;

interface RecordingButtonProps {
  className?: string;
  isRecording?: boolean;
  isPlaying?: boolean;
  onClick?: () => void;
  color?: string;
  size?: number;
}

const GreenRecordingButton: FC<RecordingButtonProps> = ({
  className = '',
  isRecording = false,
  isPlaying = false,
  onClick,
  color = '#22c55e',
  size = 0.9,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const isRecordingRef = useRef(isRecording);
  const isPlayingRef = useRef(isPlaying);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrameId: number;
    let time = 0, lastTime = 0;

    const vMouse = new THREE.Vector2();
    const vMouseDamp = new THREE.Vector2();
    const vResolution = new THREE.Vector2();

    let w = 1, h = 1;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera();
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setClearColor(0x000000, 0);
    
    mount.appendChild(renderer.domElement);

    const geo = new THREE.PlaneGeometry(1, 1);
    
    const baseColor = new THREE.Color(color);
    const lighterColor = baseColor.clone().multiplyScalar(1.4);
    
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_mouse: { value: vMouseDamp },
        u_resolution: { value: vResolution },
        u_pixelRatio: { value: 3 },
        u_shapeSize: { value: size },
        u_circleSize: { value: 0.35 },
        u_circleEdge: { value: 0.6 },
        u_color: { value: baseColor },
        u_color2: { value: lighterColor },
        u_time: { value: 0 },
        u_isPlaying: { value: 0 }
      },
      transparent: true,
    });
    
    materialRef.current = material;

    const quad = new THREE.Mesh(geo, material);
    scene.add(quad);

    const onPointerMove = (e: PointerEvent | MouseEvent) => {
      if (!mount) return;
      const rect = mount.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      vMouse.set(x, y);
    };

    mount.addEventListener('mousemove', onPointerMove);
    mount.addEventListener('pointermove', onPointerMove);
    mount.addEventListener('mouseleave', () => {
      vMouse.set(w/2, h/2); 
    });

    const resize = () => {
      if (!mountRef.current) return;
      const container = mountRef.current;
      w = container.clientWidth;
      h = container.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      renderer.setSize(w, h);
      renderer.setPixelRatio(dpr);

      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();

      quad.scale.set(w, h, 1);
      vResolution.set(w, h).multiplyScalar(dpr);
      material.uniforms.u_pixelRatio.value = dpr;
    };

    resize();
    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(() => resize());
    ro.observe(mountRef.current as Element);

    const update = () => {
      time = performance.now() * 0.001;
      const dt = time - lastTime;
      lastTime = time;

      vMouseDamp.x = THREE.MathUtils.damp(vMouseDamp.x, vMouse.x, 10, dt);
      vMouseDamp.y = THREE.MathUtils.damp(vMouseDamp.y, vMouse.y, 10, dt);

      // Always animate time when recording OR playing
      material.uniforms.u_time.value = (isRecordingRef.current || isPlayingRef.current) ? time : 0;
      material.uniforms.u_isPlaying.value = isPlayingRef.current ? 1.0 : 0.0;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(update);
    };
    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      ro.disconnect();
      if(mount) {
        mount.removeEventListener('mousemove', onPointerMove);
        mount.removeEventListener('pointermove', onPointerMove);
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [color, size]);

  useEffect(() => {
    if (materialRef.current) {
      const baseColor = new THREE.Color(color);
      const lighterColor = baseColor.clone().multiplyScalar(1.4);
      materialRef.current.uniforms.u_color.value.set(color);
      materialRef.current.uniforms.u_color2.value = lighterColor;
      materialRef.current.uniforms.u_shapeSize.value = size;
    }
  }, [color, size]);

  const handleClick = () => {
    if (!isPlaying && onClick) {
      onClick();
    }
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className="relative">
        {/* Recording glow rings */}
        {isRecording && !isPlaying && (
          <motion.div initial={{scale: 0}} animate={{scale:1}}>
            <div className="absolute inset-0 rounded-full animate-ping opacity-30" 
                 style={{ 
                   background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
                   animationDuration: '2s'
                 }} 
            />
            <div className="absolute inset-0 rounded-full animate-pulse opacity-40" 
                 style={{ 
                   background: `radial-gradient(circle, ${color}60 0%, transparent 70%)`,
                   filter: 'blur(20px)'
                 }} 
            />
          </motion.div>
        )}

        {/* Playing state: Rotating rings and particles */}
        {isPlaying && (
          <>
            {/* Outer rotating ring */}
            <motion.div initial={{scale: 0}} animate={{scale:1}}
              className="absolute inset-[-20px] rounded-full animate-spin opacity-60"
              style={{ 
                animationDuration: '8s',
                background: `conic-gradient(from 0deg, transparent 0%, ${color}60 10%, transparent 20%, transparent 80%, ${color}60 90%, transparent 100%)`,
                filter: 'blur(15px)'
              }} 
            />
            {/* Inner rotating ring - opposite direction */}
            <motion.div initial={{scale: 0}} animate={{scale:1}}
              className="absolute inset-[-10px] rounded-full opacity-50"
              style={{ 
                animation: 'spin 6s linear infinite reverse',
                background: `conic-gradient(from 45deg, transparent 0%, ${color}80 5%, transparent 15%, transparent 85%, ${color}80 95%, transparent 100%)`,
                filter: 'blur(10px)'
              }} 
            />
          </>
        )}
        
        {/* Main button container */}
        <div 
          ref={mountRef}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative w-32 h-32 overflow-hidden rounded-full
            transition-all duration-500 ease-out
            ${isPlaying ? 'cursor-not-allowed opacity-90' : 'cursor-pointer'}
            ${isHovered && !isPlaying ? 'scale-105' : 'scale-100'}
            ${isRecording && !isPlaying ? 'shadow-2xl' : 'shadow-xl'}
          `}
          style={{
            boxShadow: isRecording && !isPlaying
              ? `0 0 60px ${color}80, 0 0 100px ${color}40, inset 0 0 20px ${color}20`
              : isPlaying
              ? `0 0 40px ${color}60, 0 0 80px ${color}30, inset 0 0 30px ${color}15`
              : `0 10px 40px ${color}30, inset 0 0 20px ${color}10`,
          }}
          title={isPlaying ? "Playing..." : isRecording ? "Stop Recording" : "Start Recording"}
        >
          {/* Glassmorphism overlay */}
          <div 
            className="absolute inset-0 rounded-full backdrop-blur-sm bg-white/5 border border-white/20"
            style={{
              background: `linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)`,
            }}
          />
          
          {/* Inner highlight */}
          <div 
            className="absolute top-2 left-2 right-2 h-8 rounded-full opacity-40"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)',
              filter: 'blur(8px)'
            }}
          />
          
          {/* Status indicator */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
             {isRecording ? (
              // Recording: Pulsing square
              <div 
                className="w-6 h-6 rounded-sm bg-white/90 animate-pulse shadow-lg"
                style={{
                  animationDuration: '1.5s'
                }}
              />
            ) : (
              // Idle: Circle outline
              <div className="w-8 h-8 rounded-full border-3 border-white/80" />
            )}
          </div>
          
          {/* Bottom shadow */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-8 rounded-full opacity-30"
            style={{
              background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)',
              filter: 'blur(6px)'
            }}
          />
        </div>
      
      </div>

      {/* Keyframes for equalizer animation */}
      <style>{`
        @keyframes equalizer {
          0%, 100% { height: 30%; }
          50% { height: 80%; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default GreenRecordingButton;