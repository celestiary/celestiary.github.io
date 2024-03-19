import * as THREE from 'three'

import Loader from './Loader.js'
import Object from './object.js'
import PickLabels from './PickLabels.js'
import SpriteSheet from './SpriteSheet.js'
import StarsBufferGeometry from './StarsBufferGeometry.js'
import StarsCatalog, {FAVES} from './StarsCatalog.js'
import {assertDefined} from './assert.js'
import * as Material from './material.js'
import {FAR_OBJ} from './shared.js'
import {named} from './utils.js'


// > 10k is too much for my old laptop.
const MAX_LABELS = 10000

/** */
export default class Stars extends Object {
  /**
   * @param {object} props
   * @param {Function} ui Accessor to zustand store for shared application state
   * @param {object} [catalog]
   * @param {Function} [onLoadCb]
   * @param {boolean} [showLabels]
   */
  constructor(props, ui, catalog, onLoadCb, showLabels = false) {
    super('Stars', props)
    assertDefined(ui, ui.useStore)
    this.ui = ui
    this.labelsGroup = named(new THREE.Group, 'LabelsGroup')
    this.onLoadCb = onLoadCb
    this.faves = FAVES
    this.labelLOD = named(new THREE.LOD, 'LabelsLOD')
    this.labelLOD.visible = showLabels
    this.labelLOD.addLevel(this.labelsGroup, 1)
    this.labelLOD.addLevel(FAR_OBJ, 1e14)
    this.add(this.labelLOD)
    this.geom = null

    // Used by guide/Asterisms.jsx to center camera.
    this.labelCenterPosByName = {}

    if (catalog instanceof StarsCatalog) {
      if (!catalog.starByHip) {
        throw new Error('Invalid stars catalog')
      }
      this.catalog = catalog
      this.show()
      if (showLabels) {
        this.showLabels()
      }
    } else {
      this.catalog = new StarsCatalog()
      this.catalog.load(() => {
        this.show()
        this.showLabels()
      })
    }

    // used by About for catalog stats
    this.ui.useStore.setState({starsCatalog: this.catalog})
  }


  /** */
  show() {
    this.geom = new StarsBufferGeometry(this.catalog)
    const starImage = Material.pathTexture('star_glow', '.png')
    const starsMaterial = new THREE.ShaderMaterial({
      uniforms: {
        texSampler: {value: starImage},
      },
      vertexShader: '/shaders/stars.vert',
      fragmentShader: '/shaders/stars.frag',
      blending: THREE.AdditiveBlending,
      depthTest: true,
      depthWrite: false,
      transparent: true,
    })
    const me = this
    new Loader().loadShaders(starsMaterial, () => {
      const starPoints = named(new THREE.Points(this.geom, starsMaterial), 'StarsPoints')
      starPoints.sortParticles = true
      this.add(starPoints)
      window.sp = starPoints
      new PickLabels(me.ui, me)
      if (this.onLoadCb) {
        this.onLoadCb()
      }
    })
    /*
    const simpleSunMatr = new THREE.PointsMaterial({
      size: 3,
      sizeAttenuation: false,
    })
    this.add(new THREE.Points(this.geom, simpleSunMatr))
    */
  }


  /** */
  showLabels(level = 2) {
    const toShow = []
    this.addFaves(toShow)
    this.catalog.starByHip.forEach((star, hipId) => {
      if (this.faves.get(hipId)) {
        return
      }
      const names = this.catalog.namesByHip.get(hipId)
      if (names && names.length > level) {
        toShow.push([star, names[0]])
      } else if (star.absMag < -5) {
        toShow.push([star, `HIP ${ hipId}`])
      }
      if (toShow.length >= MAX_LABELS) {
        console.warn(`Stars#showLabels: hit max count of ${ MAX_LABELS}`)
      }
    })
    this.starLabelSpriteSheet = new SpriteSheet(toShow.length, 'Rigel Kentaurus B')
    for (let i = 0; i < toShow.length; i++) {
      const [star, name] = toShow[i]
      this.showStarName(star, name)
    }
    this.labelsGroup.add(this.starLabelSpriteSheet.compile())
  }


  /** */
  showStarName(star, name) {
    const scale = this.catalog.starScale
    const x = scale * star.x
    const y = scale * star.y
    const z = scale * star.z
    const sPos = new THREE.Vector3(x, y, z)
    this.starLabelSpriteSheet.add(x, y, z, name)
    this.labelCenterPosByName[name] = sPos
  }


  /** */
  addFaves(toShow) {
    this.faves.forEach((name, hipId) => {
      const star = this.catalog.starByHip.get(hipId)
      if (star === undefined) {
        throw new Error(`Undefined star for hipId(${hipId})`)
      }
      toShow.push([star, name])
    })
  }
}
