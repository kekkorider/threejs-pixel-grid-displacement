import {
  Scene,
  WebGLRenderer,
  OrthographicCamera,
  PlaneGeometry,
  Mesh,
  Clock,
  Vector2,
  Raycaster
} from 'three'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

import { GridMaterial } from './materials/GridMaterial'
import { textureLoader } from './loaders'

import { GPGPU } from './GPGPU'

gsap.registerPlugin(Observer)

class App {
  #resizeCallback = () => this.#onResize()

  constructor(container, opts = { physics: false, debug: false }) {
    this.container = document.querySelector(container)
    this.screen = new Vector2(this.container.clientWidth, this.container.clientHeight)

    this.hasPhysics = opts.physics
    this.hasDebug = opts.debug
  }

  async init() {
    this.#createScene()
    this.#createCamera()
    this.#createRenderer()

    this.#createPlane()
    const img = await textureLoader.load('/dim-gunger-MSrN0wXcN8A-unsplash.jpg')
    this.plane.material.uniforms.t_Texture.value = img

    this.gpgpu = new GPGPU({ size: 27, renderer: this.renderer })

    this.#createRaycaster()
    this.#createMouseObserver()

    this.#createClock()
    this.#addListeners()

    if (this.hasDebug) {
      const { Debug } = await import('./Debug.js')
      new Debug(this)

      const { default: Stats } = await import('stats.js')
      this.stats = new Stats()
      document.body.appendChild(this.stats.dom)
    }

    this.renderer.setAnimationLoop(() => {
      this.stats?.begin()

      this.#update()
      this.#render()

      this.stats?.end()
    })

    console.log(this)
  }

  destroy() {
    this.renderer.dispose()
    this.#removeListeners()
  }

  #update() {
    const elapsed = this.clock.getElapsedTime()

    this.gpgpu.render()
    this.plane.material.uniforms.t_Grid.value = this.gpgpu.getTexture()
  }

  #render() {
    this.renderer.render(this.scene, this.camera)
  }

  #createScene() {
    this.scene = new Scene()
  }

  #createCamera() {
    this.camera = new OrthographicCamera()
    this.camera.position.set(0, 0, 1)
  }

  #createRenderer() {
    const params = {
      alpha: false,
      antialias: window.devicePixelRatio === 1
    }

    this.renderer = new WebGLRenderer({ ...params })

    this.container.appendChild(this.renderer.domElement)

    this.renderer.setSize(this.screen.x, this.screen.y)
    this.renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio))
    this.renderer.setClearColor(0x121212)
    this.renderer.physicallyCorrectLights = true
  }

  #createRaycaster() {
    this.raycaster = new Raycaster()
  }

  #createMouseObserver() {
    this.mouse = new Vector2()

    this.mouseObserver = Observer.create({
      target: this.container,
      type: 'pointer',
      onMove: (event) => {
        this.mouse.x = (event.x / this.screen.x) * 2 - 1
        this.mouse.y = -(event.y / this.screen.y) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera)

        const intersects = this.raycaster.intersectObject(this.scene)
        const target = intersects?.[0] ?? null

        if (!!!target) return

        this.gpgpu.updateMouse(target.uv)
      }
    })
  }

  #createPlane() {
    const geometry = new PlaneGeometry(1.9, 1.9)
    this.plane = new Mesh(geometry, GridMaterial)

    this.scene.add(this.plane)
  }

  #createClock() {
    this.clock = new Clock()
  }

  #addListeners() {
    window.addEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #removeListeners() {
    window.removeEventListener('resize', this.#resizeCallback, { passive: true })
  }

  #onResize() {
    this.screen.set(this.container.clientWidth, this.container.clientHeight)

    this.camera.aspect = this.screen.x / this.screen.y
    this.camera.updateProjectionMatrix()

    this.renderer.setSize(this.screen.x, this.screen.y)
  }
}

window._APP_ = new App('#app', {
  physics: window.location.hash.includes('physics'),
  debug: window.location.hash.includes('debug')
})

window._APP_.init()
