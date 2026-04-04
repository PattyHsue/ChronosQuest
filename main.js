import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class CPUDemo {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.setupScene();
        this.setupLights();
        this.createCPU();
        this.createParticles();
        this.setupControls();
        this.animate();
        
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Simulating loading time for effect
        setTimeout(() => {
            document.getElementById('loader').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loader').style.display = 'none';
            }, 1000);
        }, 1500);

        this.setupInteraction();
    }

    setupScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x05050a);
        this.scene.fog = new THREE.FogExp2(0x05050a, 0.05);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(10, 8, 10);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x00f2ff, 150, 20);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x7000ff, 150, 20);
        pointLight2.position.set(-5, 3, -5);
        this.scene.add(pointLight2);
    }

    createCPU() {
        this.cpuGroup = new THREE.Group();

        // CPU Substrate
        const substrateGeo = new THREE.BoxGeometry(6, 0.4, 6);
        const substrateMat = new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            roughness: 0.2, 
            metalness: 0.8 
        });
        const substrate = new THREE.Mesh(substrateGeo, substrateMat);
        this.cpuGroup.add(substrate);

        // Heat Spreader (IHS)
        const ihsGeo = new THREE.BoxGeometry(4.2, 0.3, 4.2);
        const ihsMat = new THREE.MeshStandardMaterial({ 
            color: 0xcccccc, 
            metalness: 1, 
            roughness: 0.1 
        });
        const ihs = new THREE.Mesh(ihsGeo, ihsMat);
        ihs.position.y = 0.35;
        this.cpuGroup.add(ihs);

        // Circuit paths (Glowing lines)
        const lineMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff });
        for(let i = 0; i < 20; i++) {
            const lineGeo = new THREE.BoxGeometry(i % 2 === 0 ? 5.8 : 0.1, 0.05, i % 2 === 0 ? 0.1 : 5.8);
            const line = new THREE.Mesh(lineGeo, lineMat);
            line.position.y = 0.21;
            line.position.x = (Math.random() - 0.5) * 5;
            line.position.z = (Math.random() - 0.5) * 5;
            this.cpuGroup.add(line);
        }

        // The "Core" (Internal glow)
        const coreGeo = new THREE.BoxGeometry(1.5, 0.1, 1.5);
        const coreMat = new THREE.MeshBasicMaterial({ 
            color: 0x7000ff,
            transparent: true,
            opacity: 0.8
        });
        this.core = new THREE.Mesh(coreGeo, coreMat);
        this.core.position.y = 0.36;
        this.cpuGroup.add(this.core);

        this.scene.add(this.cpuGroup);
    }

    createParticles() {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color1 = new THREE.Color(0x00f2ff);
        const color2 = new THREE.Color(0x7000ff);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 5;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;

            const mixedColor = color1.clone().lerp(color2, Math.random());
            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    setupControls() {
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.maxDistance = 25;
        this.controls.minDistance = 5;
    }

    setupInteraction() {
        this.isOverclocked = false;
        window.addEventListener('mousedown', () => {
            this.overclock(true);
        });
        window.addEventListener('mouseup', () => {
            this.overclock(false);
        });
    }

    overclock(active) {
        this.isOverclocked = active;
        const clockVal = document.getElementById('clock-val');
        const tempVal = document.getElementById('temp-val');
        const clockBar = document.getElementById('clock-bar');
        const tempBar = document.getElementById('temp-bar');

        if (active) {
            clockVal.innerText = "6.50 GHz";
            clockVal.style.color = "#ff007a";
            tempVal.innerText = "88°C";
            tempVal.style.color = "#ff007a";
            clockBar.style.width = "100%";
            tempBar.style.width = "95%";
            this.controls.autoRotateSpeed = 5;
        } else {
            clockVal.innerText = "5.20 GHz";
            clockVal.style.color = "white";
            tempVal.innerText = "42°C";
            tempVal.style.color = "white";
            clockBar.style.width = "85%";
            tempBar.style.width = "40%";
            this.controls.autoRotateSpeed = 0.5;
        }
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();

        // Animate particles (Simulate data flow)
        const positions = this.particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            // Move towards center slightly
            positions[i] *= 0.995;
            positions[i + 2] *= 0.995;
            
            // If close to center, reset to outside
            if (Math.abs(positions[i]) < 0.1 && Math.abs(positions[i+2]) < 0.1) {
                const angle = Math.random() * Math.PI * 2;
                const dist = 10 + Math.random() * 5;
                positions[i] = Math.cos(angle) * dist;
                positions[i + 2] = Math.sin(angle) * dist;
                positions[i+1] = (Math.random() - 0.5) * 5;
            }
        }
        this.particles.geometry.attributes.position.needsUpdate = true;

        // Core pulsing
        const pulse = Math.sin(Date.now() * (this.isOverclocked ? 0.02 : 0.005)) * 0.2 + 0.8;
        this.core.scale.set(pulse, 1, pulse);
        this.core.material.opacity = pulse * 0.5;

        this.renderer.render(this.scene, this.camera);
    }
}

new CPUDemo();
