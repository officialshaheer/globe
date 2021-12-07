import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  camera: any;

  constructor() { }

  ngOnInit(): void {

    //Canvas
    const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
    //Scene Initialisation  
    const scene = new THREE.Scene();

    const textureLoader = new THREE.TextureLoader();

    // Earth
    const sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(1, 30, 30),
      new THREE.MeshBasicMaterial({ map: textureLoader.load('assets/textures/earth2.jpeg') })
    )
    scene.add(sphere)

    // Adding pins
    const pin = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.1, 20, 20),
      new THREE.MeshBasicMaterial({color: 0xff0000})
    )
    scene.add(pin)
    pin.position.set(1,0,0)

    //Renderer Size
    const sizes = {
      width: innerWidth,
      height: innerHeight
    }

    //Render Initialisation
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setClearColor(0x000000)

    //Camera Initialisation
    this.camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
    this.camera.position.x = 0
    this.camera.position.y = 5
    this.camera.position.z = 0

    scene.add(this.camera)

    //Controls
    const controls = new OrbitControls(this.camera, canvas)
    controls.enableDamping = true;

    //Resize Event
    window.addEventListener('resize', () => {
      // Update sizes
      sizes.width = window.innerWidth
      sizes.height = window.innerHeight

      //Update camera
      this.camera.aspect = sizes.width / sizes.height
      this.camera.updateProjectionMatrix()

      //Update renderer
      renderer.setSize(sizes.width, sizes.height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    })

    //Animate
    const tick = () => {
      controls.update()
      //Rendering Section
      renderer.render(scene, this.camera)
      window.requestAnimationFrame(tick)
    }

    tick();

  }

}
