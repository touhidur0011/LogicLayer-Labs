import type { Object3DNode } from '@react-three/fiber';
import type * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    // Geometries
    boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
    planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
    sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
    ringGeometry: Object3DNode<THREE.RingGeometry, typeof THREE.RingGeometry>;
    
    // Materials
    meshStandardMaterial: Object3DNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
    meshBasicMaterial: Object3DNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
    
    // Objects
    group: Object3DNode<THREE.Group, typeof THREE.Group>;
    mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
    
    // Lights
    ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
    directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
    pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
    spotLight: Object3DNode<THREE.SpotLight, typeof THREE.SpotLight>;
    
    // Other
    fog: Object3DNode<THREE.Fog, typeof THREE.Fog>;
  }
}
