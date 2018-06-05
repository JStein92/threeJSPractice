import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.css']
})
export class CubeComponent implements AfterViewInit {
  /* HELPER PROPERTIES (PRIVATE PROPERTIES) */
  private camera: THREE.PerspectiveCamera;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }
  @ViewChild('canvas')
  private canvasRef: ElementRef;
  private cube: THREE.Mesh;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;

  /* CUBE PROPERTIES */
  public rotationSpeedX = 0.005;
  public rotationSpeedY = 0.01;
  public size = 5;

  /* STAGE PROPERTIES */
  public cameraZ = 40;
  public fieldOfView = 70;
  public nearClippingPane = 1;
  public farClippingPane = 1000;

  /* DEPENDENCY INJECTION (CONSTRUCTOR) */
  constructor() { }



  /* STAGING, ANIMATION, AND RENDERING */

  /**
  * Animate the cube
  */
  private animateCube() {
    this.cube.rotation.x += this.rotationSpeedX;
    this.cube.rotation.y += this.rotationSpeedY;
  }

  /**
  * Create the cube
  */
  private createCube() {
    const material = new THREE.MeshStandardMaterial({ color: 'blue' });
    const geometry = new THREE.BoxBufferGeometry(this.size, this.size, this.size);
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.receiveShadow = true;
    this.cube.castShadow = true;

    // Add cube to scene
     // this.scene.add(this.cube);
  }

  private createFloor() {
    const geo = new THREE.PlaneBufferGeometry(100, 100, 32, 32);
    const mat = new THREE.MeshPhongMaterial({ color: 0xd3ede0, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(geo, mat);
    plane.receiveShadow = true;
    this.scene.add(plane);
    plane.rotateX( - Math.PI / 2);
    plane.position.set(0, -5, 0);
  }

  private createCustomBox() {
    const loader = new GLTFLoader();
    // Load a glTF resource
    loader.load('../../assets/models/box.gltf', gltf => {
    console.log(gltf);
      this.scene.add( gltf.scene );
      // gltf.animations; // Array<THREE.AnimationClip>
      // gltf.scene; // THREE.Scene
      // gltf.scenes; // Array<THREE.Scene>
      // gltf.cameras; // Array<THREE.Camera>
      // gltf.asset; // Object
    },
    // called when loading is in progresses
    function ( xhr ) {
    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  },
  // called when loading has errors
  function ( error ) {
  console.log( 'An error happened', error );
  }
);
}

/**
* Create the scene
*/
private createScene() {
  /* Scene */
  this.scene = new THREE.Scene();

  /* Camera */
  const aspectRatio = this.getAspectRatio();
  this.camera = new THREE.PerspectiveCamera(
    this.fieldOfView,
    aspectRatio,
    this.nearClippingPane,
    this.farClippingPane
  );
  this.camera.position.z = this.cameraZ;
  this.camera.rotation.x = -.5;
  this.camera.position.y = 10;
  this.scene.background = new THREE.Color(0x00000);
}

private createLights() {
  const spotLight = new THREE.SpotLight( 0xffffff, .5 );
  spotLight.position.set( 5, 20, 5 );

  spotLight.castShadow = true;

  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;

  spotLight.shadow.camera.near = 1;
  spotLight.shadow.camera.far = 4000;
  spotLight.shadow.camera.fov = 30;

  this.scene.add( spotLight );

  const light = new THREE.AmbientLight( 0x404040, 1 ); // soft white light
  this.scene.add( light );

}

private getAspectRatio() {
  return window.innerWidth / window.innerHeight;
}

/**
* Start the rendering loop
*/
private startRenderingLoop() {
  /* Renderer */
  // Use canvas element in template
  this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
  this.renderer.setPixelRatio(devicePixelRatio);
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.renderer.shadowMap.enabled = true;
  this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

  const component: CubeComponent = this;
  (function render() {
    requestAnimationFrame(render);
    component.animateCube();
    component.renderer.render(component.scene, component.camera);
  }());
}


/* EVENTS */

/**
* Update scene after resizing.
*/
public onResize() {
  this.camera.aspect = this.getAspectRatio();
  this.camera.updateProjectionMatrix();

  this.renderer.setSize(window.innerWidth, window.innerHeight);
}


/* LIFECYCLE */

/**
* We need to wait until template is bound to DOM, as we need the view
* dimensions to create the scene. We could create the cube in a Init hook,
* but we would be unable to add it to the scene until now.
*/
public ngAfterViewInit() {
  this.createScene();
  this.createFloor();
  this.createCube();
  this.createLights();
  this.createCustomBox();
  this.startRenderingLoop();
}

}
