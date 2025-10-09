import * as THREE from 'three';

export class SpiralController {
    constructor(config = {}) {
        this.radius = config.radius || 300;
        this.verticalSpacing = config.verticalSpacing || 80;
        this.rotations = config.rotations || 2;
        this.segments = config.segments || 50;
        this.curve = null;
        this.points = [];
        this.tangents = [];
        this.normals = [];
        this.totalLength = 0;

        this.generate();
    }

    generate() {
        // Generate parametric helix points
        const points = [];
        const tMax = this.rotations * Math.PI * 2;
        const totalHeight = tMax * this.verticalSpacing;

        for (let i = 0; i <= this.segments; i++) {
            const t = (i / this.segments) * tMax;
            
            // Expanding spiral formula
            const expansion = 1 + (t / (tMax * 0.8));
            const x = this.radius * Math.cos(t) * expansion;
            const y = t * this.verticalSpacing - totalHeight / 2;
            const z = this.radius * Math.sin(t) * expansion;

            points.push(new THREE.Vector3(x, y, z));
        }

        // Create smooth curve
        this.curve = new THREE.CatmullRomCurve3(points);
        this.curve.curveType = 'catmullrom';
        this.curve.tension = 0.5;

        // Calculate total length
        this.totalLength = this.curve.getLength();

        // Pre-calculate tangents and normals
        this.calculateVectors();

        console.log(`✓ Spiral generated: ${this.segments} segments, length: ${this.totalLength.toFixed(2)}`);
    }

    calculateVectors() {
        const divisions = 100;
        this.points = [];
        this.tangents = [];
        this.normals = [];

        for (let i = 0; i <= divisions; i++) {
            const t = i / divisions;
            
            // Position
            const position = this.curve.getPoint(t);
            this.points.push(position);

            // Tangent
            const tangent = this.curve.getTangent(t);
            this.tangents.push(tangent);

            // Normal (perpendicular to tangent)
            const normal = new THREE.Vector3();
            if (Math.abs(tangent.y) < 0.99) {
                normal.crossVectors(tangent, new THREE.Vector3(0, 1, 0)).normalize();
            } else {
                normal.crossVectors(tangent, new THREE.Vector3(1, 0, 0)).normalize();
            }
            this.normals.push(normal);
        }
    }

    getPointAt(progress) {
        // Clamp progress
        progress = Math.max(0, Math.min(1, progress));

        // Get position on curve
        const position = this.curve.getPoint(progress);
        const tangent = this.curve.getTangent(progress);

        // Calculate rotation to face center with slight tilt
        const lookAtTarget = new THREE.Vector3(0, position.y, 0);
        const direction = new THREE.Vector3().subVectors(lookAtTarget, position).normalize();

        const rotation = new THREE.Euler();
        const quaternion = new THREE.Quaternion();
        
        // Create matrix looking at center
        const matrix = new THREE.Matrix4();
        matrix.lookAt(position, lookAtTarget, new THREE.Vector3(0, 1, 0));
        quaternion.setFromRotationMatrix(matrix);
        rotation.setFromQuaternion(quaternion);

        // Add slight tilt based on position
        rotation.z += Math.sin(progress * Math.PI * 4) * 0.1;

        return {
            position,
            rotation,
            tangent,
            progress
        };
    }

    getUniformPoints(count) {
        // Distribute points evenly by arc length
        const points = [];
        
        for (let i = 0; i < count; i++) {
            const progress = i / Math.max(1, count - 1);
            points.push(this.getPointAt(progress));
        }

        return points;
    }

    createDebugLine(scene) {
        // Visual representation of the spiral path
        const points = this.curve.getPoints(200);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x10b981,
            opacity: 0.3,
            transparent: true
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        return line;
    }

    createTubeMesh(scene) {
        // Tube geometry for better visualization
        const tubeGeometry = new THREE.TubeGeometry(
            this.curve,
            100,
            2,
            8,
            false
        );
        const tubeMaterial = new THREE.MeshBasicMaterial({
            color: 0x6366f1,
            opacity: 0.1,
            transparent: true,
            wireframe: true
        });
        const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
        scene.add(tube);
        return tube;
    }

    update(deltaTime) {
        // Update logic if needed (e.g., animated spiral)
    }

    dispose() {
        if (this.curve) {
            this.curve = null;
        }
        this.points = [];
        this.tangents = [];
        this.normals = [];
    }
}
