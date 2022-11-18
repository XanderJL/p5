import { ColorValue, Draw, Setup } from '@react-p5/core'
import Sketch from 'components/Sketch'
import { NextPage } from 'next'
import type { Vector } from 'p5'
import { Mover2 } from 'types/Mover'
import { setupDefaults } from 'util/defaults'

const width: number = 640
const height: number = 360
const dimensions: number[] = [width, height]
const padding: number[] = [40]
const background: ColorValue = [255]
let location: Vector
let velocity: Vector
let acceleration: Vector

const setup: Setup = (p5, canvasParentRef) => {
  location = p5.createVector(p5.width / 2, p5.height / 2)
  velocity = p5.createVector(0, 0)
  acceleration = p5.createVector(-0.001, 0.01)
  setupDefaults({ p5, canvasParentRef, dimensions, padding, background })
}

const draw: Draw = p5 => {
  p5.background(background)

  const mover = new Mover2(p5, location, velocity, acceleration)

  mover.update()
  mover.checkEdges()
  mover.display()
}

const Noc_1_8: NextPage = () => <Sketch setup={setup} draw={draw} />

export default Noc_1_8
