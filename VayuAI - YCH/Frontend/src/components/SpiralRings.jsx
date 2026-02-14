import { Renderer, Program, Mesh, Color, Cylinder } from 'ogl';
import { useEffect, useRef } from 'react';
import './SpiralRings.css';

const VERT = `#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;
in vec2 uv;
in vec3 instancePosition;
in vec3 instanceRotation;
in vec3 instanceScale;
in float instanceIndex;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

out vec3 vNormal;
out vec2 vUv;
out float vIndex;
out vec3 vViewPosition;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

void main() {
    vNormal = normalize(normalMatrix * normal);
    vUv = uv;
    vIndex = instanceIndex;

    // Apply rotation
    mat4 rotX = rotationMatrix(vec3(1, 0, 0), instanceRotation.x);
    mat4 rotY = rotationMatrix(vec3(0, 1, 0), instanceRotation.y);
    mat4 rotZ = rotationMatrix(vec3(0, 0, 1), instanceRotation.z);
    
    vec4 pos = rotZ * rotY * rotX * vec4(position * instanceScale, 1.0);
    pos.xyz += instancePosition;

    vec4 viewPos = modelViewMatrix * pos;
    vViewPosition = -viewPos.xyz;
    gl_Position = projectionMatrix * viewPos;
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;

in vec3 vNormal;
in vec2 vUv;
in float vIndex;
in vec3 vViewPosition;

out vec4 fragColor;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    
    // Fresnel effect for glass rim
    float fresnel = pow(1.0 - max(0.0, dot(normal, viewDir)), 2.5);
    
    // Gradient coloring across the spiral
    vec3 baseColor = mix(uColor1, uColor2, sin(vIndex * 0.1 + uTime * 0.5) * 0.5 + 0.5);
    
    // Glossy highlights
    float spec = pow(max(0.0, dot(normal, normalize(vec3(1, 1, 1)))), 32.0);
    
    vec3 color = baseColor;
    color += spec * 0.3;
    color += fresnel * 0.6;
    
    // Circular mask on the cylinder cap
    float dist = distance(vUv, vec2(0.5));
    float mask = smoothstep(0.5, 0.48, dist);
    
    float alpha = (0.2 + fresnel * 0.8) * mask;
    
    fragColor = vec4(color * alpha, alpha);
}
`;

export default function SpiralRings({
    count = 120,
    speed = 0.4,
    color1 = '#9d50bb', // Mid purple
    color2 = '#6e48aa'  // Deeper purple
}) {
    const containerRef = useRef(null);
    const speedRef = useRef(speed);
    speedRef.current = speed;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const renderer = new Renderer({ alpha: true, antialias: true, premultipliedAlpha: false });
        const gl = renderer.gl;
        container.appendChild(gl.canvas);

        const program = new Program(gl, {
            vertex: VERT,
            fragment: FRAG,
            uniforms: {
                uTime: { value: 0 },
                uColor1: { value: new Color(color1) },
                uColor2: { value: new Color(color2) },
                modelViewMatrix: { value: new Float32Array(16) },
                projectionMatrix: { value: new Float32Array(16) },
                normalMatrix: { value: [1, 0, 0, 0, 1, 0, 0, 0, 1] }
            },
            transparent: true,
            depthTest: false,
            cullFace: false
        });

        // Larger discs
        const geometry = new Cylinder(gl, {
            radiusTop: 3.5,
            radiusBottom: 3.5,
            height: 0.1,
            radialSegments: 64,
            heightSegments: 1
        });

        const instancePosition = new Float32Array(count * 3);
        const instanceRotation = new Float32Array(count * 3);
        const instanceScale = new Float32Array(count * 3);
        const instanceIndex = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            const progress = i / count;
            const angle = progress * Math.PI * 5.0; // Slightly tighter spiral
            const radius = 10.0 + progress * 20.0;
            const x = Math.cos(angle) * radius;
            const y = (progress - 0.5) * 45.0;
            const z = Math.sin(angle) * radius - 10.0;

            instancePosition.set([x, y, z], i * 3);
            instanceRotation.set([Math.PI * 0.2, angle + Math.PI * 0.5, 0], i * 3);

            const s = 0.9 + Math.random() * 0.3;
            instanceScale.set([s, 1, s], i * 3);
            instanceIndex[i] = i;
        }

        geometry.addAttribute('instancePosition', { instanced: 1, size: 3, data: instancePosition });
        geometry.addAttribute('instanceRotation', { instanced: 1, size: 3, data: instanceRotation });
        geometry.addAttribute('instanceScale', { instanced: 1, size: 3, data: instanceScale });
        geometry.addAttribute('instanceIndex', { instanced: 1, size: 1, data: instanceIndex });

        const mesh = new Mesh(gl, { geometry, program });

        const projection = new Float32Array(16);
        const modelView = new Float32Array(16);

        const resize = () => {
            if (!container) return;
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            renderer.setSize(width, height);

            const aspect = width / height;
            const fov = 45 * (Math.PI / 180);
            const near = 0.1;
            const far = 100;
            const f = 1.0 / Math.tan(fov / 2);

            projection.fill(0);
            projection[0] = f / aspect;
            projection[5] = f;
            projection[10] = (far + near) / (near - far);
            projection[11] = -1;
            projection[14] = (2 * far * near) / (near - far);

            program.uniforms.projectionMatrix.value = projection;
        };

        window.addEventListener('resize', resize);
        resize();

        let request;
        const update = (t) => {
            request = requestAnimationFrame(update);
            program.uniforms.uTime.value = t * 0.001 * speedRef.current;

            modelView.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, -50, 1]);
            program.uniforms.modelViewMatrix.value = modelView;

            renderer.render({ scene: mesh });
        };
        request = requestAnimationFrame(update);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(request);
            if (gl.canvas.parentNode === container) container.removeChild(gl.canvas);
            gl.getExtension('WEBGL_lose_context')?.loseContext();
        };
    }, [count, color1, color2]);

    return <div ref={containerRef} className="spiral-rings-container" />;
}
