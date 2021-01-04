import * as THREE from "three";
import debounce from "lodash/debounce";
import random from "lodash/random";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {BokehPass} from "three/examples/jsm/postprocessing/BokehPass";

export default class Background {

    constructor(){
        const aspect = window.innerWidth / window.innerHeight;

        this.camera = new THREE.PerspectiveCamera(70, aspect, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1B1B1D);
        this.scene.fog = new THREE.Fog(0x1B1B1D, 0.5, 1.7);

        
        this.generateGeo();


        this.light = new THREE.DirectionalLight( 0xffffff, 0.6 );
        this.light.position.set(-3, 6, 2);
        this.scene.add(this.light);

        this.backLight = new THREE.AmbientLight( 0xffffff, 0.2 );
        this.scene.add(this.backLight);


        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setAnimationLoop(this.animation.bind(this));

        this.renderer.domElement.classList.add("pageBg");
        document.body.append( this.renderer.domElement );

        window.addEventListener("resize", debounce(this.resize.bind(this), 200));


        this.renderPass = new RenderPass(this.scene, this.camera);
        this.bokehPass = new BokehPass(this.scene, this.camera, {
            focus: 0.75,
            aperture: 0.09,
            maxblur: 0.02,
            width: window.innerWidth,
            height: window.innerHeight,
        });

        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass( this.renderPass );
        this.composer.addPass( this.bokehPass );
    }


    generateGeo(){
        if(this.planeMesh){
            this.scene.remove(this.planeMesh);
        }

        const aspect = window.innerWidth / window.innerHeight;

        this.planeGeo = new THREE.PlaneGeometry(2.2 * aspect, 2.2, 20 * aspect, 20);
        this.planeMat = new THREE.MeshPhongMaterial({
            color: 0x1B1B1D,
            specular: 0x005300,
            shininess: 40,
            flatShading: true,
        });
        this.planeMesh = new THREE.Mesh(this.planeGeo, this.planeMat);
        this.scene.add(this.planeMesh);

        const verts = this.planeGeo.vertices;
        this.Zs = [];
        verts.forEach(v3 => {
            const z = random(-0.02, 0.02);
            v3.set(
                v3.x + random(-0.01, 0.01),
                v3.y + random(-0.01, 0.01),
                v3.z + z,
            );
            this.Zs.push(z);
        });
        this.planeGeo.vertices = verts;
        this.planeGeo.verticesNeedUpdate = true;
        this.planeGeo.normalsNeedUpdate = true;
        this.planeGeo.computeFlatVertexNormals();

        this.planeMesh.rotation.x = -0.6;
        this.planeMesh.position.y = 0.3;
    }


    animation(time){
        const delta = Date.now() - this.lastFrame;
        this.planeGeo.vertices.forEach((v3, i) => {
            let offset = (time / 5000) + (this.Zs[(i+1) % this.Zs.length] * 5000);
            v3.setZ( v3.z + (Math.sin(offset) * 0.00005) );
        });
        this.planeGeo.verticesNeedUpdate = true;
        this.planeGeo.computeFlatVertexNormals();

        // this.particles.position.x = Math.cos(time / 20000) / 15;
        // this.particles.position.y = Math.cos(time / 15000) / 25;

        //this.renderer.render(this.scene, this.camera);
        this.composer.render(delta);
        this.lastFrame = Date.now();
    }


    resize(){
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.composer.setSize(window.innerWidth, window.innerHeight);
        this.generateGeo();
    }

}