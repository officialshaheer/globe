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
      new THREE.MeshBasicMaterial({ map: textureLoader.load('assets/textures/earth.jpeg') })
    )
    scene.add(sphere)

    // Adding pins
    const pin1 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.03, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xff0000 })
    )

    const pin2 = new THREE.Mesh(
      new THREE.SphereBufferGeometry(0.03, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    )


    let point1 = {
      lat: 50.4501,
      lng: 30.5234
    }

    let point2 = {
      lat: 80.6345,
      lng: 30.5528
    }

    let pos = this.convertLatLngToCartesian(point1);
    let pos1 = this.convertLatLngToCartesian(point2);
    

    pin1.position.set(pos.x, pos.y, pos.z)
    pin2.position.set(pos1.x, pos1.y, pos1.z)
    scene.add(pin1)
    scene.add(pin2)


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
    this.camera.position.y = 3
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

  convertLatLngToCartesian(p) {
    let lat = (90 - p.lat) * Math.PI / 180;
    let lng = (180 +p.lng)* Math.PI / 180;

    let x = -Math.sin(lat) * Math.cos(lng);
    let y = Math.sin(lat) * Math.sin(lng);
    let z = Math.cos(lat);

    return {
      x,y,z
    }

  }

}
