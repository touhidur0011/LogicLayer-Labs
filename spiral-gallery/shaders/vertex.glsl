precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDistortion;

uniform float time;
uniform vec2 mousePosition;
uniform float scrollVelocity;
uniform float hoverProgress;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 pos = position;
    
    // Wave distortion effect
    float wave = sin(pos.y * 0.02 + time * 2.0) * 5.0;
    float wave2 = cos(pos.x * 0.03 + time * 1.5) * 3.0;
    pos.z = pos.z + wave + wave2;
    
    // Mouse interaction
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vec2 mouseDir = worldPosition.xy - mousePosition;
    float mouseDist = length(mouseDir);
    float mouseInfluence = smoothstep(200.0, 0.0, mouseDist);
    
    // Push away from mouse
    pos.z = pos.z + mouseInfluence * 20.0;
    if (mouseDist > 0.01) {
        pos.xy = pos.xy - normalize(mouseDir) * mouseInfluence * 10.0;
    }
    
    // Scroll velocity twist
    float twist = scrollVelocity * 0.3;
    float angle = pos.y * 0.001 * twist;
    float cosA = cos(angle);
    float sinA = sin(angle);
    vec2 rotated = vec2(cosA * pos.x - sinA * pos.z, sinA * pos.x + cosA * pos.z);
    pos.x = rotated.x;
    pos.z = rotated.y;
    
    // NO hover scale effect - keep size the same
    // pos = pos * mix(1.0, 1.05, hoverProgress); // REMOVED
    
    vDistortion = wave + wave2;
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
