precision mediump float;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vDistortion;

uniform sampler2D map;
uniform float time;
uniform float opacity;
uniform float hoverProgress;
uniform float glowIntensity;
uniform vec3 glowColor;
uniform vec3 cameraPosition;

void main() {
    vec2 uv = vUv;
    
    // Sample texture
    vec4 texColor = texture2D(map, uv);
    
    // Chromatic aberration on hover
    if (hoverProgress > 0.01) {
        float aberration = hoverProgress * 0.003;
        float r = texture2D(map, uv + vec2(aberration, 0.0)).r;
        float g = texture2D(map, uv).g;
        float b = texture2D(map, uv - vec2(aberration, 0.0)).b;
        texColor = vec4(r, g, b, texColor.a);
    }
    
    // Rim lighting
    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
    float rimAmount = 1.0 - max(0.0, dot(viewDirection, normalize(vNormal)));
    float rim = pow(rimAmount, 3.0);
    
    // Holographic effect
    float holographic = sin(rim * 10.0 + time * 2.0) * 0.5 + 0.5;
    vec3 holoColor = mix(vec3(0.06, 0.73, 0.51), vec3(0.39, 0.40, 0.95), holographic);
    
    // Scanline effect
    float scanline = sin(vUv.y * 200.0 + time * 3.0) * 0.02;
    
    // Combine effects
    vec3 finalColor = texColor.rgb;
    finalColor = finalColor + holoColor * rim * 0.3;
    finalColor = finalColor + glowColor * hoverProgress * glowIntensity * (rim + 0.2);
    finalColor = finalColor + vec3(scanline);
    finalColor = finalColor + vec3(vDistortion * 0.002);
    
    // Distance fog
    float depth = gl_FragCoord.z / gl_FragCoord.w;
    float fogFactor = smoothstep(800.0, 1500.0, depth);
    finalColor = mix(finalColor, vec3(0.0), fogFactor);
    
    gl_FragColor = vec4(finalColor, texColor.a * opacity);
}
